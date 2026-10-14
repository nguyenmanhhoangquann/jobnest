package com.jobnest.service;

import com.jobnest.dto.JobCreateRequest;
import com.jobnest.dto.JobDto;
import com.jobnest.entity.Category;
import com.jobnest.entity.Company;
import com.jobnest.entity.Job;
import com.jobnest.entity.SavedJob;
import com.jobnest.entity.User;
import com.jobnest.repository.CategoryRepository;
import com.jobnest.repository.CompanyRepository;
import com.jobnest.repository.JobRepository;
import com.jobnest.repository.SavedJobRepository;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import lombok.extern.slf4j.Slf4j;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final CategoryRepository categoryRepository;
    private final CompanyRepository companyRepository;
    private final SavedJobRepository savedJobRepository;

    public Page<JobDto> getJobs(String keyword, String category, String area, String jobType,
                               String experience, String position, Integer salaryMin, Integer salaryMax,
                               String salary, Pageable pageable, User currentUser) {

        Specification<Job> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (keyword != null && !keyword.trim().isEmpty()) {
                String kw = "%" + keyword.trim().toLowerCase() + "%";
                Predicate pTitle = cb.like(cb.lower(root.get("title")), kw);
                Predicate pDesc = cb.like(cb.lower(root.get("description")), kw);
                Predicate pReq = cb.like(cb.lower(root.get("requirements")), kw);
                Predicate pComp = cb.like(cb.lower(root.join("company", JoinType.LEFT).get("name")), kw);
                predicates.add(cb.or(pTitle, pDesc, pReq, pComp));
            }

            if (category != null && !category.trim().isEmpty() && !"all".equalsIgnoreCase(category) && !"Tất cả".equalsIgnoreCase(category)) {
                predicates.add(cb.equal(cb.lower(root.join("category", JoinType.LEFT).get("slug")), category.trim().toLowerCase()));
            }

            if (area != null && !area.trim().isEmpty() && !"all".equalsIgnoreCase(area) && !"Tất cả".equalsIgnoreCase(area)) {
                String cleanArea = area.trim().toLowerCase();
                Predicate pArea = cb.equal(cb.lower(root.get("area")), cleanArea);
                Predicate pRegion = cb.like(cb.lower(root.get("region")), "%" + cleanArea + "%");
                Predicate pLoc = cb.like(cb.lower(root.get("location")), "%" + cleanArea + "%");
                predicates.add(cb.or(pArea, pRegion, pLoc));
            }

            if (jobType != null && !jobType.trim().isEmpty() && !"all".equalsIgnoreCase(jobType) && !"ALL".equalsIgnoreCase(jobType)) {
                predicates.add(cb.equal(root.get("jobType"), jobType.trim()));
            }

            if (experience != null && !experience.trim().isEmpty() && !"all".equalsIgnoreCase(experience) && !"ALL".equalsIgnoreCase(experience)) {
                String exp = experience.trim();
                if ("1-year".equalsIgnoreCase(exp)) exp = "1-2";
                else if ("2-years".equalsIgnoreCase(exp)) exp = "2-5";
                else if ("5-plus".equalsIgnoreCase(exp)) exp = "5+";
                Predicate pExp = cb.equal(root.get("experience"), exp);
                Predicate pExpRaw = cb.equal(root.get("experience"), experience.trim());
                predicates.add(cb.or(pExp, pExpRaw));
            }

            if (position != null && !position.trim().isEmpty() && !"all".equalsIgnoreCase(position) && !"ALL".equalsIgnoreCase(position)) {
                predicates.add(cb.equal(root.get("position"), position.trim()));
            }

            if (salaryMin != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("salaryMin"), salaryMin));
            }

            if (salaryMax != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("salaryMax"), salaryMax));
            }

            if (salary != null && !salary.isBlank() && !"all".equalsIgnoreCase(salary)) {
                if (salary.contains("under")) {
                    predicates.add(cb.and(cb.isNotNull(root.get("salaryMax")), cb.le(root.get("salaryMax"), 10)));
                } else if (salary.contains("10-20") || salary.contains("10-15") || salary.contains("15-20")) {
                    predicates.add(cb.and(cb.ge(root.get("salaryMax"), 10), cb.le(root.get("salaryMin"), 20)));
                } else if (salary.contains("20-30") || salary.contains("20-25") || salary.contains("25-30")) {
                    predicates.add(cb.and(cb.ge(root.get("salaryMax"), 20), cb.le(root.get("salaryMin"), 30)));
                } else if (salary.contains("over") || salary.contains("above") || salary.contains("30")) {
                    predicates.add(cb.and(cb.isNotNull(root.get("salaryMax")), cb.ge(root.get("salaryMax"), 30)));
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Job> jobs = jobRepository.findAll(spec, pageable);
        return jobs.map(j -> mapToDto(j, currentUser));
    }

    public List<JobDto> getRandomJobs(String type, String area, Integer limit, User currentUser) {
        int max = (limit != null && limit > 0) ? limit : 9;
        String filterType = (type != null && !"ALL".equalsIgnoreCase(type) && !"all".equalsIgnoreCase(type)) ? type : null;
        String filterArea = (area != null && !"ALL".equalsIgnoreCase(area) && !"all".equalsIgnoreCase(area) && !"Tất cả".equalsIgnoreCase(area)) ? area : null;

        List<Job> jobs = jobRepository.findRandomJobsFilter(filterType, filterArea, max);
        return jobs.stream().map(j -> mapToDto(j, currentUser)).collect(Collectors.toList());
    }

    public JobDto getJobDetail(Long id, User currentUser) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy công việc"));
        return mapToDto(job, currentUser);
    }

    public List<JobDto> getMyJobs(User employer) {
        if (employer == null) return List.of();
        List<Job> jobs;
        if (employer.getRole() == com.jobnest.entity.Role.ADMIN) {
            jobs = jobRepository.findAll();
        } else {
            jobs = jobRepository.findByEmployerId(employer.getId());
            if (jobs.isEmpty() && employer.getCompanyName() != null && !employer.getCompanyName().isBlank()) {
                jobs = jobRepository.findAll().stream()
                        .filter(j -> j.getCompany() != null && employer.getCompanyName().equalsIgnoreCase(j.getCompany().getName()))
                        .collect(Collectors.toList());
            }
        }
        return jobs.stream().map(j -> mapToDto(j, employer)).collect(Collectors.toList());
    }

    @Transactional
    public JobDto createJob(JobCreateRequest request, User employer) {
        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId()).orElse(null);
        }
        if (category == null && request.getCategory() != null) {
            category = categoryRepository.findBySlug(request.getCategory().toLowerCase()).orElse(null);
        }
        if (category == null) {
            category = categoryRepository.findAll().stream().findFirst().orElse(null);
        }

        Company company = null;
        if (employer != null && employer.getCompanyName() != null) {
            company = companyRepository.findByName(employer.getCompanyName()).orElse(null);
            if (company == null) {
                company = companyRepository.save(Company.builder()
                        .name(employer.getCompanyName())
                        .location(request.getLocation() != null ? request.getLocation() : "Hà Nội")
                        .logoUrl("/images/companies/fpt.svg")
                        .build());
            }
        }
        if (company == null) {
            company = companyRepository.findAll().stream().findFirst().orElse(null);
        }

        Job job = Job.builder()
                .title(request.getTitle())
                .category(category)
                .company(company)
                .employer(employer)
                .location(request.getLocation())
                .area(request.getArea() != null ? request.getArea() : "ha-noi")
                .region(request.getRegion() != null ? request.getRegion() : "Miền Bắc")
                .salaryText(request.getSalaryText())
                .salaryMin(request.getSalaryMin())
                .salaryMax(request.getSalaryMax())
                .position(request.getPosition())
                .jobType(request.getJobType())
                .experience(request.getExperience())
                .deadline(request.getDeadline())
                .quantity(request.getQuantity() != null ? request.getQuantity() : 1)
                .description(request.getDescription())
                .requirements(request.getRequirements())
                .benefits(request.getBenefits())
                .isHot(true)
                .isUrgent(false)
                .isTop(false)
                .build();

        Job saved = jobRepository.save(job);
        return mapToDto(saved, employer);
    }

    @Transactional
    public JobDto updateJob(Long id, JobCreateRequest request, User employer) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy công việc"));

        log.info("SECURITY CHECK updateJob: employer={}, role={}, jobEmployer={}",
                employer != null ? employer.getId() : "null",
                employer != null ? employer.getRole() : "null",
                job.getEmployer() != null ? job.getEmployer().getId() : "null");

        if (employer == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Vui lòng đăng nhập");
        }

        if (employer.getRole() != com.jobnest.entity.Role.ADMIN) {
            if (job.getEmployer() == null || !job.getEmployer().getId().equals(employer.getId())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Bạn không có quyền thao tác trên tin của công ty khác");
            }
        }

        if (request.getTitle() != null) job.setTitle(request.getTitle());
        if (request.getLocation() != null) job.setLocation(request.getLocation());
        if (request.getSalaryText() != null) job.setSalaryText(request.getSalaryText());
        if (request.getPosition() != null) job.setPosition(request.getPosition());
        if (request.getJobType() != null) job.setJobType(request.getJobType());
        if (request.getExperience() != null) job.setExperience(request.getExperience());
        if (request.getDeadline() != null) job.setDeadline(request.getDeadline());
        if (request.getDescription() != null) job.setDescription(request.getDescription());
        if (request.getRequirements() != null) job.setRequirements(request.getRequirements());
        if (request.getBenefits() != null) job.setBenefits(request.getBenefits());

        Job updated = jobRepository.save(job);
        return mapToDto(updated, employer);
    }

    @Transactional
    public void deleteJob(Long id, User employer) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy công việc"));

        if (employer == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Vui lòng đăng nhập");
        }

        if (employer.getRole() != com.jobnest.entity.Role.ADMIN) {
            if (job.getEmployer() == null || !job.getEmployer().getId().equals(employer.getId())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Bạn không có quyền xóa tin của công ty khác");
            }
        }
        jobRepository.delete(job);
    }

    @Transactional
    public void saveJob(Long jobId, User candidate) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy công việc"));

        if (!savedJobRepository.existsByUserIdAndJobId(candidate.getId(), jobId)) {
            savedJobRepository.save(SavedJob.builder()
                    .user(candidate)
                    .job(job)
                    .build());
        }
    }

    @Transactional
    public void unsaveJob(Long jobId, User candidate) {
        savedJobRepository.deleteByUserIdAndJobId(candidate.getId(), jobId);
    }

    public Page<JobDto> getSavedJobs(Pageable pageable, User candidate) {
        Page<SavedJob> page = savedJobRepository.findByUserIdOrderBySavedAtDesc(candidate.getId(), pageable);
        return page.map(sj -> {
            JobDto dto = mapToDto(sj.getJob(), candidate);
            dto.setSaved(true);
            return dto;
        });
    }

    public JobDto mapToDto(Job job, User currentUser) {
        boolean isSaved = false;
        if (currentUser != null && currentUser.getId() != null) {
            isSaved = savedJobRepository.existsByUserIdAndJobId(currentUser.getId(), job.getId());
        }

        JobDto.CategoryDto catDto = null;
        if (job.getCategory() != null) {
            catDto = JobDto.CategoryDto.builder()
                    .id(job.getCategory().getId())
                    .slug(job.getCategory().getSlug())
                    .name(job.getCategory().getName())
                    .build();
        }

        JobDto.CompanyDto compDto = null;
        if (job.getCompany() != null) {
            compDto = JobDto.CompanyDto.builder()
                    .id(job.getCompany().getId())
                    .name(job.getCompany().getName())
                    .logoUrl(job.getCompany().getLogoUrl())
                    .location(job.getCompany().getLocation())
                    .build();
        }

        return JobDto.builder()
                .id(job.getId())
                .title(job.getTitle())
                .salaryText(job.getSalaryText())
                .salaryMin(job.getSalaryMin())
                .salaryMax(job.getSalaryMax())
                .location(job.getLocation())
                .area(job.getArea())
                .region(job.getRegion())
                .jobType(job.getJobType())
                .experience(job.getExperience())
                .position(job.getPosition())
                .category(catDto)
                .company(compDto)
                .isHot(job.getIsHot() != null && job.getIsHot())
                .isUrgent(job.getIsUrgent() != null && job.getIsUrgent())
                .isTop(job.getIsTop() != null && job.getIsTop())
                .saved(isSaved)
                .description(job.getDescription())
                .requirements(job.getRequirements())
                .benefits(job.getBenefits())
                .quantity(job.getQuantity())
                .deadline(job.getDeadline())
                .createdAt(job.getCreatedAt())
                .updatedAt(job.getUpdatedAt())
                .build();
    }
}
