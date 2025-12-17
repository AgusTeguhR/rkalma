import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Maulid = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(
      "/ayat/maulid/Maulid_Azab?name=Maulid%20Azab",
      { replace: true }
    );
  }, [navigate]);

  return null;
};

export default Maulid;
