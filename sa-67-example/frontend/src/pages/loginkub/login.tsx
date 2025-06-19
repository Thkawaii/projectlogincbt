import { useState } from "react";
import Swal from "sweetalert2";
import "./Login.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // ใช้งาน useNavigate

  const handleLogin = () => {
    if (!email && !password) {
      Swal.fire({
        icon: "error",
        title: "กรุณากรอกข้อมูล Password และ Email ให้ครบถ้วน",
      });
      return;
    }

    if (!email) {
      Swal.fire({
        icon: "error",
        title: "กรุณากรอก Email",
      });
      return;
    }

    if (!password) {
      Swal.fire({
        icon: "error",
        title: "กรุณากรอก Password",
      });
      return;
    }

    const isGmail = email.endsWith("@gmail.com");
    const isDepressionEmail = email.endsWith("@depressionrec.go.th");

    if (!isGmail && !isDepressionEmail) {
      Swal.fire({
        icon: "error",
        title: "รูปแบบอีเมลไม่ถูกต้อง",
      });
      return;
    }

    if (isDepressionEmail && !password.startsWith("psychohealth")) {
      Swal.fire({
        icon: "error",
        title: "Password ไม่ถูกต้องตามเงื่อนไขที่กำหนด",
      });
      return;
    }

    // ล็อกอินสำเร็จ
    Swal.fire({
      title: "Login Success!",
      icon: "success",
      confirmButtonText: "OK",
      customClass: {
        popup: "composition-popup",
        title: "composition-title",
        confirmButton: "composition-confirm-btn",
        icon: "composition-icon",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        if (isDepressionEmail) {
          navigate("/homedoc"); // สำหรับอีเมลของ depressionrec.go.th
        } else {
          navigate("/homepage"); // สำหรับทั่วไป
        }
      }
    });
  };

  return (
    <div className="hospitalcare-container">
      <div className="hospitalcare-box">
        <h2 className="hospitalcare-title">ล็อกอิน</h2>

        <label htmlFor="email" className="hospitalcare-label">Email</label>
        <input
          id="email"
          type="email"
          placeholder="กรุณากรอก email ของคุณ"
          className="hospitalcare-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password" className="hospitalcare-label">Password</label>
        <input
          id="password"
          type="password"
          placeholder="กรุณากรอก password ของคุณ"
          className="hospitalcare-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="hospitalcare-button" onClick={handleLogin}>
          เข้าสู่ระบบ
        </button>
      </div>
    </div>
  );
}

export default Login;
