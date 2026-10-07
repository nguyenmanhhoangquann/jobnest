import json
import re

with open('C:/Users/A/JobNest/topcv_full_jobs.json', encoding='utf-8') as f:
    batch1 = json.load(f)

with open('C:/Users/A/JobNest/topcv_more_jobs.json', encoding='utf-8') as f:
    batch2 = json.load(f)

combined = batch1 + batch2
seen = set()
unique_jobs = []
for r in combined:
    t = r['title'].strip()
    c = r['company'].strip()
    key = (t, c)
    if key not in seen:
        seen.add(key)
        unique_jobs.append(r)

print('Total unique combined jobs:', len(unique_jobs))

def clean_title(title):
    t = re.sub(r'^(GẤP|Tin mới|HOT|TOP|Tuyển gấp|Pro)[\s\n\:\-]+', '', title, flags=re.I)
    t = re.sub(r'[\s\n]+', ' ', t).strip()
    return t

def clean_company(comp):
    c = re.sub(r'^(Pro|Top|Hot)[\s\n]+', '', comp, flags=re.I)
    c = re.sub(r'[\s\n]+', ' ', c).strip()
    return c

def parse_salary(sal):
    sal = sal.strip()
    m_range = re.search(r'(\d+)\s*-\s*(\d+)\s*triệu', sal, re.I)
    if m_range:
        return sal, int(m_range.group(1)), int(m_range.group(2))
    m_up = re.search(r'(?:Tới|Up to|Đến)\s*(\d+)\s*triệu', sal, re.I)
    if m_up:
        return sal, int(m_up.group(1)) // 2, int(m_up.group(1))
    return sal, 0, 0

def map_location_and_region(loc):
    loc_clean = re.sub(r'\s*\([^)]*\)', '', loc)
    loc_clean = re.sub(r'&.*', '', loc_clean).strip()
    if 'Hà Nội' in loc:
        return 'Hà Nội', 'ha-noi', 'Miền Bắc'
    if 'Hồ Chí Minh' in loc or 'TP. HCM' in loc or 'Sài Gòn' in loc:
        return 'TP. Hồ Chí Minh', 'ho-chi-minh', 'Miền Nam'
    if 'Đà Nẵng' in loc:
        return 'Đà Nẵng', 'da-nang', 'Miền Trung'
    if 'Bình Dương' in loc or 'Đồng Nai' in loc or 'Long An' in loc or 'Cần Thơ' in loc:
        return loc_clean, 'mien-nam', 'Miền Nam'
    if 'Bắc Ninh' in loc or 'Hải Phòng' in loc or 'Hưng Yên' in loc or 'Quảng Ninh' in loc:
        return loc_clean, 'mien-bac', 'Miền Bắc'
    if 'Huế' in loc or 'Nghệ An' in loc or 'Khánh Hòa' in loc:
        return loc_clean, 'mien-trung', 'Miền Trung'
    return 'Hà Nội', 'ha-noi', 'Miền Bắc'

def map_category(title):
    t = title.lower()
    if any(k in t for k in ['react', 'node', 'java', 'frontend', 'backend', 'developer', 'lập trình', 'devops', 'it', 'kỹ thuật phần mềm', 'cntt', 'tester', 'qa', 'ai ', 'engineer', 'kỹ sư', 'software']):
        return {'id': 1, 'slug': 'cntt', 'name': 'Công nghệ thông tin'}
    if any(k in t for k in ['marketing', 'content', 'seo', 'truyền thông', 'pr', 'media', 'quảng cáo', 'tiktok']):
        return {'id': 2, 'slug': 'marketing', 'name': 'Marketing - Truyền thông'}
    if any(k in t for k in ['kinh doanh', 'sales', 'sale', 'bán hàng', 'thương mại', 'tư vấn', 'đại lý', 'khách hàng', 'account manager']):
        return {'id': 3, 'slug': 'kinh-doanh', 'name': 'Kinh doanh - Bán hàng (Sales)'}
    if any(k in t for k in ['thiết kế', 'designer', 'graphic', 'ui', 'ux', 'nội thất', 'shopdrawing']):
        return {'id': 4, 'slug': 'thiet-ke', 'name': 'Thiết kế - Sáng tạo'}
    if any(k in t for k in ['kế toán', 'kiểm toán', 'thuế', 'tax', 'kế toán viên', 'accountant']):
        return {'id': 5, 'slug': 'ke-toan', 'name': 'Kế toán - Kiểm toán'}
    if any(k in t for k in ['nhân sự', 'tuyển dụng', 'hr', 'hành chính', 'c&b', 'talent']):
        return {'id': 6, 'slug': 'nhan-su', 'name': 'Nhân sự - Hành chính'}
    if any(k in t for k in ['ngân hàng', 'tài chính', 'tín dụng', 'bảo hiểm', 'đầu tư', 'chứng khoán']):
        return {'id': 7, 'slug': 'tai-chinh', 'name': 'Tài chính - Ngân hàng'}
    if any(k in t for k in ['bất động sản', 'bđs', 'nhà đất', 'môi giới', 'căn hộ']):
        return {'id': 10, 'slug': 'bat-dong-san', 'name': 'Bất động sản'}
    return {'id': 3, 'slug': 'kinh-doanh', 'name': 'Kinh doanh - Bán hàng (Sales)'}

formatted = []
for idx, r in enumerate(unique_jobs[:80]):
    job_id = 100 + idx + 1
    title = clean_title(r['title'])
    company_name = clean_company(r['company'])
    salary_text, s_min, s_max = parse_salary(r.get('salary') or 'Thoả thuận')
    loc, area, region = map_location_and_region(r.get('location') or 'Hà Nội')
    cat = map_category(title)
    logo = r.get('logo') or ''
    if not logo.startswith('http'):
        logo = ''
    
    j_type = 'FULL_TIME'
    if 'thực tập' in title.lower() or 'intern' in title.lower() or 'sinh viên' in title.lower():
        j_type = 'INTERN'
    elif 'part time' in title.lower() or 'bán thời gian' in title.lower():
        j_type = 'PART_TIME'
    elif idx % 5 == 0:
        j_type = 'INTERN'
    elif idx % 7 == 0:
        j_type = 'PART_TIME'
        
    exp = '1-2' if idx % 2 == 0 else ('lt1' if idx % 3 == 0 else '2-5')
    pos = 'staff' if idx % 3 == 0 else ('specialist' if idx % 2 == 0 else 'manager')
    
    formatted.append({
        'id': job_id,
        'title': title,
        'salaryText': salary_text,
        'salaryMin': s_min,
        'salaryMax': s_max,
        'location': loc,
        'area': area,
        'region': region,
        'jobType': j_type,
        'experience': exp,
        'position': pos,
        'category': cat,
        'company': {
            'id': idx + 1,
            'name': company_name,
            'logoUrl': logo
        },
        'isHot': r.get('isHot') or (idx % 4 == 0),
        'isUrgent': idx % 5 == 0,
        'isTop': r.get('isTop') or (idx % 3 == 0),
        'saved': idx == 0 or idx == 3 or idx == 12,
        'description': f'Thực hiện nhiệm vụ chuyên môn theo yêu cầu của vị trí {title} tại {company_name}.\nPhối hợp cùng các phòng ban chức năng để hoàn thành chỉ tiêu công việc được giao.\nBáo cáo trực tiếp tiến độ cho trưởng bộ phận và ban giám đốc.',
        'requirements': 'Tốt nghiệp Cao đẳng/Đại học chuyên ngành liên quan.\nCó tinh thần trách nhiệm cao, chủ động trong công việc và khả năng làm việc nhóm tốt.\nƯu tiên ứng viên có kinh nghiệm thực tế tương đương.',
        'benefits': f'Mức lương cạnh tranh: {salary_text}.\nĐầy đủ chế độ bảo hiểm BHXH, BHYT theo luật lao động.\nThưởng hiệu quả công việc, thưởng lễ tết và cơ hội thăng tiến rõ ràng.',
        'deadline': '2026-12-31',
        'quantity': (idx % 5) + 2,
        'createdAt': f'2026-10-{max(1, 28 - (idx % 25)):02d}T09:00:00'
    })

print('Formatted jobs count:', len(formatted))

js_content = 'export const mockJobs = ' + json.dumps(formatted, ensure_ascii=False, indent=2) + ';\n\nexport default mockJobs;\n'
with open('C:/Users/A/JobNest/frontend/src/mock/jobs.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print('Updated jobs.js successfully with 80 jobs!')
