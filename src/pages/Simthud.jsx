import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Simthud = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(
      "/ayat/maulid/Simthud_Dhoror?name=Simthud%20Dhoror",
      { replace: true }
    );
  }, [navigate]);

  return null;
};

export default Simthud;
