import Navbar from "../components/layout/navbar";
import Footer from "../components/layout/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="p-6">
        <h1 className="text-3xl font-bold mb-6">Welcome to ShoeShop</h1>
      </main>
      <Footer />
    </div>
  );
}