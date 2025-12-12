const LoadingBar = ({ progress, visible }) => {
  if (!visible) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "3px",
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        overflow: "hidden",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress}%`,
          backgroundColor: "#4CAF50",
          transition: "width 0.3s ease-out",
          boxShadow: "0 0 10px rgba(76, 175, 80, 0.8)",
        }}
      />
    </div>
  );
};

export default LoadingBar;
