import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";  // <-- เพิ่ม import นี้
import "./register.css";

const Register: React.FC = () => {
  const navigate = useNavigate();  // <-- เรียกใช้งาน useNavigate

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    address: "",
    dob: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    consent: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const name = target.name;
    let value: string | boolean;

    if (
      target instanceof HTMLInputElement &&
      (target.type === "checkbox" || target.type === "radio")
    ) {
      value = target.checked;
    } else {
      value = target.value;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "กรุณากรอกชื่อ";
    } else if (!/^[ก-๙a-zA-Z\s]+$/.test(formData.firstName)) {
      newErrors.firstName = "ชื่อควรเป็นภาษาไทยหรืออังกฤษเท่านั้น";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "กรุณากรอกนามสกุล";
    } else if (!/^[ก-๙a-zA-Z\s]+$/.test(formData.lastName)) {
      newErrors.lastName = "นามสกุลควรเป็นภาษาไทยหรืออังกฤษเท่านั้น";
    }

    if (!formData.gender) newErrors.gender = "กรุณาเลือกเพศ";
    if (!formData.address.trim()) newErrors.address = "กรุณากรอกที่อยู่";
    if (!formData.dob) newErrors.dob = "กรุณาเลือกวันเกิด";

    if (!formData.phone.trim()) {
      newErrors.phone = "กรุณากรอกเบอร์โทรศัพท์";
    } else if (!/^0\d{9}$/.test(formData.phone)) {
      newErrors.phone = "เบอร์โทรศัพท์ไม่ถูกต้อง (ต้องเป็นเลข 10 หลักขึ้นต้นด้วย 0)";
    }
    // ตรวจสอบ email
    if (!formData.email.trim()) {
      newErrors.email = "กรุณากรอกอีเมล";
    } else if (!/^[\w.-]+@gmail\.com$/.test(formData.email)) {
      newErrors.email = "รูปแบบ email ไม่ถูกต้อง";
    }
    if (!formData.password) newErrors.password = "กรุณากรอกรหัสผ่าน";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "รหัสผ่านไม่ตรงกัน";
    if (!formData.consent)
      newErrors.consent = "กรุณายอมรับนโยบายความเป็นส่วนตัว";

    return newErrors;
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const validationErrors = validate();
  setErrors(validationErrors);

  if (Object.keys(validationErrors).length === 0) {
    try {
      const response = await fetch("http://localhost:8080/patients/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "การลงทะเบียนล้มเหลว");
      }

      Swal.fire({
        title: "🎉 ลงทะเบียนสำเร็จ!",
        text: "ระบบได้บันทึกข้อมูลของคุณเรียบร้อยแล้ว",
        icon: "success",
        confirmButtonText: "ตกลง",
        timer: 3000,
        timerProgressBar: true,
        backdrop: true,
        showClass: {
          popup: "animate__animated animate__fadeInDown",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp",
        },
        customClass: {
          popup: "swal2-border-radius",
        },
      }).then((result) => {
        if (result.isConfirmed || result.isDismissed) {
          navigate("/cute"); // เปลี่ยนเส้นทาง
        }
      });

      // รีเซ็ตฟอร์ม
      setFormData({
        firstName: "",
        lastName: "",
        gender: "",
        address: "",
        dob: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
        consent: false,
      });

    } catch (error: any) {
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: error.message || "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    }
  }
  };

  return (
    <div className="bmser-background">
    <form className="registermed" onSubmit={handleSubmit} noValidate>
      <h2>ลงทะเบียนผู้ป่วย</h2>

      <label>
        ชื่อ
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          
        />
        {errors.firstName && (
          <div className="error-message">{errors.firstName}</div>
        )}
      </label>

      <label>
        นามสกุล
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
         
        />
        {errors.lastName && (
          <div className="error-message">{errors.lastName}</div>
        )}
      </label>

      <label>
        เพศ
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          
        >
          <option value="">เลือก</option>
          <option value="male">ชาย</option>
          <option value="female">หญิง</option>
          <option value="other">อื่นๆ</option>
        </select>
        {errors.gender && (
          <div className="error-message">{errors.gender}</div>
        )}
      </label>

      <label>
        ที่อยู่
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          
        />
        {errors.address && (
          <div className="error-message">{errors.address}</div>
        )}
      </label>

      <label>
        วันเกิด
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
       
        />
        {errors.dob && <div className="error-message">{errors.dob}</div>}
      </label>

      <label>
  เบอร์โทรศัพท์
  <input
    type="tel"
    name="phone"
    value={formData.phone}
    maxLength={10}
    onChange={(e) => {
      const cleanedValue = e.target.value.replace(/[^0-9]/g, ""); // กรองเฉพาะตัวเลข
      setFormData((prev) => ({
        ...prev,
        phone: cleanedValue,
      }));

      // ล้าง error ถ้ามี
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.phone;
        return copy;
      });
    }}
  />
  {errors.phone && <div className="error-message">{errors.phone}</div>}
</label>
    <label>
        อีเมล
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <div className="error-message">{errors.email}</div>}
      </label>

      <label>
        รหัสผ่าน
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        
        />
        {errors.password && (
          <div className="error-message">{errors.password}</div>
        )}
      </label>

      <label>
        ยืนยันรหัสผ่าน
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
       
        />
        {errors.confirmPassword && (
          <div className="error-message">{errors.confirmPassword}</div>
        )}
      </label>

 <label>
  <input
    type="checkbox"
    name="consent"
    checked={formData.consent}
    onChange={handleChange}
   
  />
  <span
    onClick={(e) => {
      e.preventDefault(); // ป้องกันการเลือกข้อความหรือคลิก link ซ้อน
      Swal.fire({
        title: "นโยบายความเป็นส่วนตัวและการให้ความยินยอม",
        html: `
          <ul style="text-align: left; padding-left: 1.2em;">
            <li>แอปพลิเคชันจะเก็บรวบรวมข้อมูลส่วนบุคคล ข้อมูลบำบัด CBT เพื่อใช้ในการให้บริการ</li>
            <li>ข้อมูลของผู้ใช้จะถูกเก็บรักษาอย่างปลอดภัยและจำกัดการเข้าถึงเฉพาะเจ้าหน้าที่ที่รับผิดชอบ</li>
            <li>ข้อมูลส่วนบุคคลจะไม่ถูกเปิดเผยแก่บุคคลที่สามโดยไม่ได้รับความยินยอมล่วงหน้า เว้นแต่เป็นไปตามกฎหมาย</li>
            <li>ผู้ใช้มีสิทธิ์เข้าถึง แก้ไข หรือลบข้อมูลส่วนบุคคลของตนเองได้ตามกฎหมายที่เกี่ยวข้อง</li>
            <li>การใช้แอปพลิเคชันถือเป็นการยินยอมให้เก็บ ใช้ และประมวลผลข้อมูลส่วนบุคคลตามนโยบายนี้</li>
            <li>
    หากมีข้อสงสัยหรือต้องการติดต่อเกี่ยวกับข้อมูลส่วนบุคคล สามารถติดต่อได้ที่<br><br>
    <img src="https://cdn-icons-png.flaticon.com/128/126/126509.png" width="16" style="vertical-align: middle; margin-right: 6px;" />
    โทรศัพท์: 094-564-3456<br><br>
    <img src="https://cdn-icons-png.flaticon.com/128/732/732200.png" width="16" style="vertical-align: middle; margin-right: 6px;" />
    อีเมล: DepressionRec@gmail.com
  </li>
          </ul>
        `,
        imageUrl: "https://cdn-icons-png.flaticon.com/128/10348/10348976.png",
        imageWidth: 64,
        imageHeight: 64,
        imageAlt: "Privacy Policy Icon",
        confirmButtonText: "ตกลง",
        customClass: {
          confirmButton: "health-btn-swal"
        },
        width: '600px',
        backdrop: true,
        showClass: {
          popup: "animate__animated animate__fadeInDown",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp",
        },
      });
    }}
    style={{ cursor: "pointer", color: "#007bff", marginLeft: "8px" }}
  >
    ยอมรับนโยบายความเป็นส่วนตัว
  </span>
</label>


      {errors.consent && (
        <div className="error-message" style={{ marginTop: 4 }}>
          {errors.consent}
        </div>
      )}
    <p className="login-link">
  มีบัญชีผู้ใช้แล้ว? <a href="/login">เข้าสู่ระบบ</a>
</p>

      <button type="submit">ลงทะเบียน</button>
    </form>
    </div>
  );
};

export default Register;
