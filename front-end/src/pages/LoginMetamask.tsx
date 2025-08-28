interface LoginMetamaskProps {
  connectWallet: (requestAccess?: boolean) => Promise<void>;
}

const LoginMetamask = ({ connectWallet }: LoginMetamaskProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/95 bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg p-6 w-96 animate-fadeIn">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Kết nối ví MetaMask
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Bạn cần kết nối ví để tiếp tục sử dụng ứng dụng.
        </p>

        <button
          onClick={() => connectWallet(true)}
          className="w-full px-6 py-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-lg transition"
        >
          Connect Metamask
        </button>
      </div>
    </div>
  );
};

export default LoginMetamask;
