export default function MobileNotSupported() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-2xl font-bold">Desktop Version Only</h1>
      <p className="text-gray-600 mt-2">
        This application is only available on desktop. Please try again from a
        larger screen.
      </p>
    </div>
  );
}
