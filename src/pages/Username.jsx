import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Base.css";
import "../styles/Username.css";
import "../styles/Button.css";
import "../styles/Form.css";
import FontStyles from "../components/FontStyles";
import BackButton from "../components/BackButton";
import axios from "axios";

function Username() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setUsername(event.target.value);
    setError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (username.trim() === "") {
      setError("닉네임을 입력해주세요.");
      return;
    }

    const usernameRegex = /^[ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9]{1,15}$/;
    if (!usernameRegex.test(username)) {
      setError("닉네임은 특수문자를 제외한 1~15자리여야 해요.");
      return;
    }

    try {
      const response = await axios.post(
        "/api/check",
        { username },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.available) {
        localStorage.setItem("username", username);
        navigate("/gender", { state: { username } });
      } else {
        setError("이미 존재하는 닉네임입니다.");
      }
    } catch (error) {
      console.error("닉네임 중복 확인 실패 : ", error);
      setError("서버 오류 발생");
    }
  };

  return (
    <>
      <FontStyles />
      <div className="main-container">
        <img
          className="background-img"
          src={process.env.PUBLIC_URL + "/img/background_gray.png"}
          alt="배경"
        />

        <BackButton />

        <div className="username-overlay">
          <form onSubmit={handleSubmit} className="name-box">
            <div className="username-question">
              <p className="question-text">잠깐, 당신의 이름은 무엇인가요?</p>
            </div>
            <input
              className={`name-box-input ${error ? "input-error" : ""}`}
              type="text"
              placeholder="닉네임을 입력하세요"
              value={username}
              onChange={handleInputChange}
              maxLength="20"
              required
            />
            <div className="username-hint">
              <p className="hint">중복 불가, 15자 이내</p>
            </div>
            {error && (
              <div className="error-text">
                <p>{error}</p>
              </div>
            )}
            <button className="next-button" type="submit">
              다음으로
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Username;