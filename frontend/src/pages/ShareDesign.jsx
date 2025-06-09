import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { cloneModelDesign } from "../api/modelCustomize";

const ShareDesign = () => {
  const { designId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Chia sẻ thiết kế sản phẩm | HHQTV Store";
  }, []);

  useEffect(() => {
    const cloneDesign = async () => {
      if (designId) {
        const sessionId = localStorage.getItem("session_id");
        if (!sessionId) {
          console.error("No session ID found");
          return;
        }

        try {
          const res = await cloneModelDesign({
            id: designId,
            sessionId,
          });

          if (res) {
            navigate(`/customize/${res.modelCustomizeResponse.id}`);
          }
        } catch (error) {
          console.error("Clone design failed:", error);
        }
      }
    };

    cloneDesign();
  }, [designId, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
      <p className="mt-6 text-lg font-semibold text-gray-700">
        Đang tải thiết kế của bạn...
      </p>
    </div>
  );
};

export default ShareDesign;
