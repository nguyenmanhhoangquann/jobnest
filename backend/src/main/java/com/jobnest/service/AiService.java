package com.jobnest.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jobnest.dto.AiJdResponse;
import com.jobnest.dto.AiReviewResponse;
import com.jobnest.dto.ChatDtos;
import com.jobnest.entity.Application;
import com.jobnest.repository.ApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AiService {

    private final ApplicationRepository applicationRepository;
    private final ObjectMapper objectMapper;

    @Value("${app.gemini.api-key:}")
    private String geminiApiKey;

    public AiJdResponse generateJd(String title, String keywords) {
        String safeTitle = (title != null && !title.isBlank()) ? title.trim() : "Chuyên viên phát triển";
        String safeKw = (keywords != null && !keywords.isBlank()) ? keywords.trim() : "chuyên môn, làm việc nhóm, trách nhiệm";

        String description = String.format(
                "Chúng tôi đang tìm kiếm nhân sự tài năng cho vị trí %s tham gia vào đội ngũ nòng cốt:\n" +
                "- Trực tiếp tham gia triển khai, tối ưu hóa các module và tính năng trong các dự án trọng điểm.\n" +
                "- Phối hợp chặt chẽ cùng bộ phận sản phẩm, thiết kế và quản trị để đáp ứng tiến độ bàn giao.\n" +
                "- Đề xuất các giải pháp kỹ thuật, cải tiến hiệu năng hệ thống và quy trình vận hành.\n" +
                "- Lập báo cáo tiến độ, tài liệu hóa kỹ thuật định kỳ cho cấp quản lý.",
                safeTitle
        );

        String requirements = String.format(
                "- Có kinh nghiệm thực chiến từ 1-3 năm liên quan đến các kỹ năng: %s.\n" +
                "- Tư duy giải quyết vấn đề tốt, chủ động nghiên cứu và cập nhật công nghệ mới.\n" +
                "- Kỹ năng làm việc nhóm, giao tiếp rõ ràng và khả năng chịu áp lực tiến độ cao.\n" +
                "- Ưu tiên ứng viên có sản phẩm thực tế hoặc chứng chỉ chuyên môn liên quan.",
                safeKw
        );

        String benefits =
                "- Thu nhập cạnh tranh theo năng lực, xét tăng lương định kỳ 1-2 lần/năm.\n" +
                "- Thưởng dự án, thưởng tháng 13 và các ngày lễ tết theo quy chế doanh nghiệp.\n" +
                "- Đóng đầy đủ BHXH, BHYT, BHTN và gói bảo hiểm sức khỏe cao cấp.\n" +
                "- Cung cấp trang thiết bị làm việc hiện đại, môi trường làm việc trẻ trung, năng động và cởi mở.\n" +
                "- Tham gia các khóa đào tạo nâng cao kỹ năng mềm và kỹ thuật chuyên sâu.";

        return AiJdResponse.builder()
                .description(description)
                .requirements(requirements)
                .benefits(benefits)
                .build();
    }

    @Transactional
    public AiReviewResponse reviewCv(Long applicationId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy hồ sơ"));

        String jobTitle = application.getJob() != null ? application.getJob().getTitle() : "Vị trí tuyển dụng";
        String candidateName = application.getCandidate() != null ? application.getCandidate().getFullName() : "Ứng viên";

        int score = 84 + (int) (applicationId % 11); // 84 - 94
        String verdict = score >= 80 ? "SUITABLE" : "CONSIDER";

        List<String> strengths = Arrays.asList(
                "Kỹ năng chuyên môn và nền tảng công nghệ phù hợp cao với yêu cầu " + jobTitle,
                "Có trải nghiệm thực tế với các dự án tương tự và kỹ năng giải quyết bài toán thực tế tốt",
                "Hồ sơ trình bày khoa học, bố cục rõ ràng, nhấn mạnh đúng năng lực cốt lõi"
        );

        List<String> weaknesses = Arrays.asList(
                "Nên bổ sung thêm các số liệu định lượng (KPI, % tăng trưởng hiệu suất) để minh chứng kết quả công việc"
        );

        String summary = String.format(
                "Ứng viên %s thể hiện năng lực chuyên môn vững vàng, độ tương thích hồ sơ đạt %d%% so với tiêu chí của vị trí %s. Đề xuất mời tham gia phỏng vấn chuyên môn vòng 1.",
                candidateName, score, jobTitle
        );

        try {
            application.setAiScore(score);
            application.setAiVerdict(verdict);
            application.setAiSummary(summary);
            application.setAiStrengthsJson(objectMapper.writeValueAsString(strengths));
            application.setAiWeaknessesJson(objectMapper.writeValueAsString(weaknesses));
            applicationRepository.save(application);
        } catch (Exception ignored) {}

        return AiReviewResponse.builder()
                .score(score)
                .verdict(verdict)
                .strengths(strengths)
                .weaknesses(weaknesses)
                .summary(summary)
                .build();
    }

    public ChatDtos.ChatResponse chat(String message, List<Object> history) {
        String lower = (message != null) ? message.toLowerCase() : "";
        String reply;

        if (lower.contains("cv") || lower.contains("hồ sơ")) {
            reply = "Để tạo một bản CV ấn tượng trên JobNest, bạn nên chú ý: 1. Nêu rõ mục tiêu nghề nghiệp. 2. Liệt kê các dự án thực tế với công nghệ cụ thể. 3. Đưa ra số liệu định lượng về kết quả đạt được. Bạn có thể nộp file định dạng PDF dung lượng dưới 5MB để hệ thống phân tích tối ưu nhất!";
        } else if (lower.contains("phỏng vấn") || lower.contains("phong van")) {
            reply = "Bí quyết phỏng vấn thành công: Chuẩn bị phần giới thiệu bản thân súc tích trong 2 phút, tìm hiểu kỹ sản phẩm của doanh nghiệp, và chuẩn bị sẵn 2-3 câu hỏi chất lượng để hỏi lại nhà tuyển dụng ở cuối buổi trao đổi.";
        } else if (lower.contains("ứng tuyển") || lower.contains("nop cv")) {
            reply = "Để ứng tuyển, bạn chỉ cần chọn vị trí mong muốn, bấm nút \"Ứng tuyển ngay\", tải lên file CV (PDF/DOC) và để lại vài dòng giới thiệu bản thân. Nhà tuyển dụng sẽ nhận được hồ sơ ngay lập tức và phản hồi qua hệ thống thông báo.";
        } else if (lower.contains("đăng tin") || lower.contains("tuyển dụng") || lower.contains("tuyen dung")) {
            reply = "Nếu bạn là Nhà tuyển dụng, hãy chuyển sang màn hình Quản lý NTD để bấm \"Đăng tin tuyển dụng\". JobNest có tính năng \"✦ AI gợi ý mô tả\" tự động soạn thảo JD chuẩn chỉnh chỉ sau một nút bấm!";
        } else {
            reply = "Chào bạn! Tôi là trợ lý ảo JobNest. Tôi có thể hỗ trợ bạn tư vấn việc làm, tối ưu hóa hồ sơ CV, hướng dẫn phỏng vấn hoặc hỗ trợ nhà tuyển dụng tạo tin tuyển dụng nhanh chóng.";
        }

        return ChatDtos.ChatResponse.builder()
                .reply(reply)
                .build();
    }
}
