import { useNavigate } from "react-router";

const useGoBack = () => {
  const navigate = useNavigate();

  const goBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1); // renterz a la page precedente
    } else {
      navigate("/"); // Rediriger vers la page home 
    }
  };

  return goBack;
};

export default useGoBack;
