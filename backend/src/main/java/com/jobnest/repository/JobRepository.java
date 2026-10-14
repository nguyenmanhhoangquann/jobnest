package com.jobnest.repository;

import com.jobnest.entity.Job;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long>, JpaSpecificationExecutor<Job> {

    @Query(value = "SELECT * FROM jobs ORDER BY RAND() LIMIT :limit", nativeQuery = true)
    List<Job> findRandomJobs(@Param("limit") int limit);

    @Query(value = "SELECT * FROM jobs WHERE (:type IS NULL OR job_type = :type) AND (:area IS NULL OR area = :area OR region = :area OR location LIKE CONCAT('%', :area, '%')) ORDER BY RAND() LIMIT :limit", nativeQuery = true)
    List<Job> findRandomJobsFilter(@Param("type") String type, @Param("area") String area, @Param("limit") int limit);

    List<Job> findByEmployerId(Long employerId);

    List<Job> findByCompanyId(Long companyId);

    long countByCategoryId(Long categoryId);
}
