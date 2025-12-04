// components/ui/Input.jsx
export default function Input({ label, error, ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-2 rounded-lg border 
          focus:outline-none focus:ring-2 focus:ring-[#00a3c4]
          ${error ? "border-red-500" : "border-gray-300"}
          disabled:bg-gray-100 disabled:cursor-not-allowed
        `}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
