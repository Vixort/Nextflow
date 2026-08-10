# 🚀 เอกสารข้อกำหนดโครงการ Nextflow (Project Documentation & PRD)

ยินดีต้อนรับสู่เอกสารข้อกำหนดและสถาปัตยกรรมของเว็บไซต์บริษัท Software House **Nextflow**

---

## 📌 1. ภาพรวมบริษัทและเป้าหมาย (Company Overview & Vision)

เราคือ **Software House ยุคใหม่** ที่มุ่งเน้นการให้บริการสองด้านหลัก:
1. **Custom Website Development**: รับพัฒนาเว็บไซต์ระดับพรีเมียม ตอบโจทย์แบรนด์และธุรกิจยุคใหม่
2. **Software & Hardware Event Management**: บริการจัดการระบบซอฟต์แวร์และฮาร์ดแวร์สำหรับงาน Event, Exhibition, Interactive Booth และงานจัดแสดงต่างๆ เช่น สื่ออินเทอร์แอคทีฟ ระบบลงทะเบียน จอแสดงผล และ IoT ภายในงาน

---

## 🎨 2. แนวทางการออกแบบ (Design & UI/UX Philosophy)

- **Mobile-First Approach (เน้นหน้าจอมือถือเป็นหลัก)**: 
  - ให้ความสำคัญกับการออกแบบและประสบการณ์ใช้งานบนสมาร์ทโฟนเป็นอันดับ 1 เนื่องจากผู้ใช้ส่วนใหญ่เข้าชมผ่านมือถือ
  - ออกแบบ Layout และองค์ประกอบต่างๆ ให้ใช้งานง่ายผ่านหน้าจอสัมผัส (Touch-friendly UI) แล้วจึงปรับขยายให้รองรับ Desktop
- **Awwwards-Grade Visual Design**:
  - สร้างความตื่นตาตื่นใจระดับรางวัลออกแบบ Awwwards
  - เน้นความสวยงามของ CSS, Glassmorphism, Micro-animations, Smooth Scrolling และดีไซน์ที่หรูหราทันสมัย

---

## 💻 3. โครงสร้างหน้าเว็บและฟีเจอร์หลัก (Core Features & Pages)

### 3.1 หน้าแรก (Home Page - Showcase & Portfolio)
- **Awwwards Interactive Showcase**: แสดงผลงานและศักยภาพด้านงานออกแบบด้วย CSS/Animation ขั้นสูง
- **Event Tech & Software Showcase**: นำเสนอผลงานระบบฮาร์ดแวร์และซอฟต์แวร์งาน Event
- **Dynamic Section Ordering**: ลำดับบล็อกและคอมโพเนนต์ในหน้า Home สามารถปรับเปลี่ยนได้ผ่านระบบ Admin

---

### 3.2 หน้า Custom Website Playground (หน้าสำหรับลูกค้าลองปรับแต่งเว็บ)
หน้าสำหรับให้ผู้ใช้หรือลูกค้าทดลองปรับแต่งแนวคิดเว็บไซต์จาก Template ที่เตรียมไว้:
- **Interactive Customization**:
  - เปลี่ยนชุดสี (Color Palette) และธีมแบบ Real-time
  - แก้ไขข้อความ สโลแกน และเนื้อหาต่างๆ (Live Text Editing)
  - ปรับสลับลำดับและย้ายคอมโพเนนต์ UI ได้อิสระ
- **Export Package Engine**:
  - สามารถ Export เว็บไซต์ที่ปรับแต่งเสร็จแล้วออกมาเป็นไฟล์ชุด **HTML, CSS และ JavaScript** นำไปใช้งานได้ทันที
- **Import File Engine**:
  - สามารถ Import ไฟล์โครงสร้าง (HTML, CSS, JS หรือ Config JSON) เข้ามาเพื่อแต่งต่อได้

---

### 3.3 ระบบผู้ดูแลระบบ (Admin Dashboard & No-Code Builder)

#### ก. ระบบจัดการหน้าแรก (Home Layout Management)
- ผู้ดูแลระบบสามารถเพิ่ม ลบ ซ่อน และสลับลำดับคอมโพเนนต์บนหน้า Home ได้โดยไม่ต้องแก้โค้ด

#### ข. ระบบ No-Code Template Builder (สร้างและแต่ง Template ได้อย่างละเอียด)
- **Visual No-Code Customization (ระดับเริ่มต้น - ปานกลาง)**:
  - สร้างและปรับแต่ง Template เว็บไซต์ผ่านปุ่มกด Color Picker, Slider, Dropdown และ Animation Presets
- **Advanced Code Injection (ระดับสูงสุด)**:
  - มีช่องทางเขียน **Custom CSS & JS** สำหรับสาย Custom ขั้นสูง เพื่อการปรับแต่งเอฟเฟกต์เฉพาะตัวที่ไม่จำกัดอยู่แค่ตัวเลือกปุ่มกด
- **Granular Component Control**: ปรับแต่งระดับพิกเซล Spacing, Typography, Responsive Breakpoints และ Animation Triggers

#### ค. ระบบ Import & Export ภายใน Admin
- **Export**: แปลง Template ที่สร้างไว้ในระบบให้ออกมาเป็นโค้ดสะอาด (Clean HTML/CSS/JS Zip Package)
- **Import**: นำเข้าไฟล์ HTML, CSS, JS หรือ JSON จากภายนอกเข้ามาเป็น Template ใหม่ในระบบได้อัตโนมัติ

---

## 📚 4. การวิจัยและเปรียบเทียบ Library สำหรับระบบ Custom Website Engine

เพื่อรองรับฟีเจอร์ Custom Website Builder ทั้งฝั่งลูกค้าและ Admin เราได้วิจัยและสรุปเลือกใช้ Library ประสิทธิภาพสูงดังนี้:

| ส่วนการทำงาน | Library ที่แนะนำ | เหตุผลและความสามารถ |
| :--- | :--- | :--- |
| **No-Code / Drag-and-Drop Engine** | **[Puck](https://puckeditor.com/)** | Puck เป็น React visual editor ที่เก็บโครงสร้างหน้าและ props เป็น JSON ได้โดยตรง จึงนำกลับมาแก้ไขและบันทึกใน Supabase JSONB ได้อย่างเสถียร |
| **Code Editor (สำหรับเขียน Custom CSS)** | **[Monaco Editor](https://microsoft.github.io/monaco-editor/)** หรือ **[CodeMirror 6](https://codemirror.net/)** | Monaco Editor คือเอนจินตัวเดียวกับ VS Code มี Syntax Highlighting, Auto-complete และ Error Checking สำหรับเขียน CSS ขั้นสูง |
| **Zip & File Exporter** | **[JSZip](https://stuk.github.io/jszip/)** + **[FileSaver.js](https://github.com/eligrey/FileSaver.js/)** | สำหรับรวบรวมไฟล์ HTML, CSS, JS บีบอัดเป็น `.zip` ให้ผู้ใช้ดาวน์โหลดได้ทันทีผ่าน Browser |
| **HTML Parser & Sanitizer** | **[DOMPurify](https://github.com/cure53/DOMPurify)** + **[HTML-React-Parser](https://github.com/remarkablemark/html-react-parser)** | ป้องกัน XSS และช่วยแปลงโครงสร้าง HTML/CSS ตอน Import เข้ามาในระบบได้อย่างปลอดภัย |
| **Animation Presets** | **[Framer Motion](https://www.framer.com/motion/)** + **[GSAP](https://gsap.com/)** | รองรับการสร้างเอฟเฟกต์การเคลื่อนไหวระดับ Awwwards ทั้งแบบกดเลือก และแบบควบคุมผ่าน CSS/JS |

---

## 🗄️ 5. โครงสร้างฐานข้อมูลบน Supabase (Database Schema Design)

```sql
-- 1. ตาราง Templates เว็บไซต์
CREATE TABLE public.templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  html_content TEXT NOT NULL,
  css_content TEXT NOT NULL,
  js_content TEXT,
  config_json JSONB DEFAULT '{}'::jsonb, -- เก็บตั้งค่า สี, ฟอนต์, และลำดับ UI
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ตาราง Customization ของผู้ใช้/ลูกค้า
CREATE TABLE public.client_customizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID REFERENCES public.templates(id) ON DELETE CASCADE,
  user_session_id TEXT,
  custom_config JSONB NOT NULL, -- ค่าสี, ข้อความ, ลำดับคอมโพเนนต์ที่ผู้ใช้แต่ง
  exported_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ตารางจัดการ Sections บนหน้าแรก (Home Page Sections)
CREATE TABLE public.home_sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT UNIQUE NOT NULL, -- เช่น 'hero', 'portfolio', 'events_tech', 'contact'
  title TEXT NOT NULL,
  is_visible BOOLEAN DEFAULT TRUE,
  display_order INT NOT NULL DEFAULT 0,
  custom_css TEXT,
  content_data JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🛣️ 6. แผนการพัฒนาต่อไป (Roadmap & Implementation Steps)

1. **เฟส 1**: สร้างหน้า Home Page (Mobile-First + Awwwards Animations Showcase)
2. **เฟส 2**: พัฒนาหน้า Custom Website Builder สำหรับลูกค้า (ระบบเปลี่ยนสี/ข้อความ/ย้าย UI + Export HTML/CSS/JS)
3. **เฟส 3**: พัฒนาหน้า Admin Dashboard & No-Code Builder (Visual Controls + Monaco CSS Code Editor)
4. **เฟส 4**: เชื่อมต่อระบบ Import/Export ไฟล์ ZIP แบบเต็มรูปแบบ
