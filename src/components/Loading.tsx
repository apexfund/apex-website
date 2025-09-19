import { PRIMARY_FONT_FAMILY } from "../utils/constants";

const Loading = () => {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            .spinner {
                animation: spin 1s linear infinite;
            }
            `,
        }}
      />

      <div className="flex flex-col items-center justify-center w-full min-h-screen gap-6">
        <h2
          className="!text-6xl !leading-tight !tracking-tight text-center text-[#96BFCF]"
          style={{ fontFamily: PRIMARY_FONT_FAMILY }}
        >
          Loading...
        </h2>

        <div
          className="spinner w-12 h-12 border-4 rounded-full"
          style={{
            border: "4px solid #e5e7eb",
            borderTop: "4px solid #96BFCF",
          }}
        ></div>
      </div>
    </>
  );
};
export default Loading;
