import { useContext } from "react";
import { useCart } from '../context/CartContextTemp';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { Image } from '../components/Image';
import { Input } from '../components/Input';
import { Link as RouterLink } from 'react-router-dom';
import { Link } from '../components/Link';
import { Text } from '../components/Text';
import { Header } from '../components/header';
import { Footer } from '../components/footer';


export const ShopPage = ({ className, children, variant, contentKey, ...props }) => {
 const { cartItems, addToCart } = useCart();
  return (
    <div className="font-body text-slate-600 antialiased bg-white">
      <>
      <Header />
         {/* Breadcrumb with banner starting after some space */}
<div className="bg-slate-50 border-b border-slate-200">
  <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
    
    {/* Breadcrumb links */}
    <nav className="flex text-sm font-medium text-slate-500">
      <Link className="hover:text-slate-900" href="index.html"> Home </Link>
      <span className="mx-2"> / </span>
      <span className="text-slate-900"> Shop </span>
    </nav>

    {/* Banner with controlled spacing */}
    <div className="ml-20">
      <img 
        src="/latanexpress-design.jpg" 
        alt="Banner" 
        className="h-12 w-[1000px] object-cover"
      />
    </div>
    
  </div>
</div>

<main className="pb-20 md:pb-0">
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar Filters */}
            <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
              {/* Categories */}
              <div>
                <h3 className="font-heading font-bold text-slate-900 mb-4"> Categories </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link className="text-green-600 font-bold" href="#"> All Products </Link>
                  </li>
                  <li>
                    <Link className="text-slate-600 hover:text-green-600" href="#"> Electronics </Link>
                  </li>
                  <li>
                    <Link className="text-slate-600 hover:text-green-600" href="#"> Fashion </Link>
                  </li>
                  <li>
                    <Link className="text-slate-600 hover:text-green-600" href="#"> Home & Living </Link>
                  </li>
                  <li>
                    <Link className="text-slate-600 hover:text-green-600" href="#"> Beauty </Link>
                  </li>
                  <li>
                    <Link className="text-slate-600 hover:text-green-600" href="#"> Accessories </Link>
                  </li>
                </ul>
              </div>
              {/* Price Range */}
              <div>
                <h3 className="font-heading font-bold text-slate-900 mb-4"> Price Range </h3>
                <div className="flex items-center gap-4 mb-4">
                  <Input variant="text" className="w-full border border-slate-300 rounded px-3 py-2 text-sm" type="number" placeholder="Min" />
                  <Text className="text-slate-400"> - </Text>
                  <Input variant="text" className="w-full border border-slate-300 rounded px-3 py-2 text-sm" type="number" placeholder="Max" />
                </div>
                <Input className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-green-600" type="range" />
              </div>
              {/* Colors */}
              <div>
                <h3 className="font-heading font-bold text-slate-900 mb-4"> Colors </h3>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary" className="w-6 h-6 rounded-full bg-black border border-slate-200 ring-2 ring-offset-2 ring-primary-600" />
                  <Button className="w-6 h-6 rounded-full bg-white border border-slate-200 hover:ring-2 hover:ring-offset-2 hover:ring-slate-300" />
                  <Button className="w-6 h-6 rounded-full bg-blue-500 border border-slate-200 hover:ring-2 hover:ring-offset-2 hover:ring-blue-300" />
                  <Button className="w-6 h-6 rounded-full bg-red-500 border border-slate-200 hover:ring-2 hover:ring-offset-2 hover:ring-red-300" />
                  <Button className="w-6 h-6 rounded-full bg-green-500 border border-slate-200 hover:ring-2 hover:ring-offset-2 hover:ring-green-300" />
                </div>
              </div>
            </aside>
            {/* Product Grid */}
            <div className="flex-1">
              {/* Sort Bar */}
              <div className="flex justify-between items-center mb-8">
                <p className="text-sm text-slate-500">
                   Showing 
                  <Text variant="bold" className="font-bold text-slate-900"> 1-9 </Text>
                   of 
                  <Text variant="bold" className="font-bold text-slate-900"> 24 </Text>
                   results 
                </p>
                <select className="border-none bg-transparent text-sm font-medium text-slate-700 focus:ring-0 cursor-pointer">
                  <option> Sort by: Featured </option>
                  <option> Price: Low to High </option>
                  <option> Price: High to Low </option>
                  <option> Newest Arrivals </option>
                </select>
              </div>
{/* Product Grid */}
<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 px-1">
  {/* Product 1 */}
  <div className="group w-full flex flex-col border border-gray-200 overflow-hidden">
    <Link className="block flex-1" href="product.html">
      <div className="w-full aspect-[3/4] bg-gray-100 relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80"
          alt="Headphones"
          className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
        />
        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1">
          SALE
        </span>
      </div>

      <h3 className="mt-2 text-xs text-slate-700 font-medium group-hover:text-green-600 px-2">
        Premium Noise-Cancelling Headphones
      </h3>

      <div className="flex items-center gap-2 mt-1 px-2">
        <p className="text-text-base font-semibold text-slate-900">$299.00</p>
        <p className="text-xs text-slate-400 line-through">$350.00</p>
      </div>
    </Link>

    <Button
  onClick={() =>
    addToCart({
      id: 1,
      name: "Premium Noise-Cancelling Headphones",
      price: 299,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80"
    })
  }
  className="w-full bg-white text-black border-t text-sm py-2"
>
  Add to Cart
</Button>
  </div>

 {/* Product 2 */}
<div className="group w-full flex flex-col border border-gray-200 overflow-hidden">
  <Link className="block flex-1" href="product.html">
    <div className="w-full aspect-[3/4] bg-gray-100 relative overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80"
        alt="Minimalist Analog Watch"
        className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
      />
      {/* Optional SALE badge */}
      {/* <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1">
        SALE
      </span> */}
    </div>

    <h3 className="mt-2 text-xs text-slate-700 font-medium group-hover:text-green-600 px-2">
      Minimalist Analog Watch
    </h3>

    <div className="flex items-center gap-2 mt-1 px-2">
      <p className="text-text-base font-semibold text-slate-900">$149.00</p>
      {/* If you have an old price, you can uncomment */}
      {/* <p className="text-xs text-slate-400 line-through">$199.00</p> */}
    </div>
  </Link>

<Button
  onClick={() =>
    addToCart({
      id: 2,
      name: "Minimalist Analog Watch",
      price: 149,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80"
    })
  }
  className="w-full bg-white text-black border-t text-sm py-2"
>
  Add to Cart
</Button>
</div>

  {/* Product 3 */}
<div className="group w-full flex flex-col border border-gray-200 overflow-hidden">
  <Link className="block flex-1" href="product.html">
    <div className="w-full aspect-[3/4] bg-gray-100 relative overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80"
        alt="Urban Runner Sneakers"
        className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
      />
      {/* Optional SALE badge */}
      {/* <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1">
        SALE
      </span> */}
    </div>

    <h3 className="mt-2 text-xs text-slate-700 font-medium group-hover:text-green-600 px-2">
      Urban Runner Sneakers
    </h3>

    <div className="flex items-center gap-2 mt-1 px-2">
      <p className="text-text-base font-semibold text-slate-900">$129.00</p>
      {/* Optional old price */}
      {/* <p className="text-xs text-slate-400 line-through">$149.00</p> */}
    </div>
  </Link>

 <Button
  onClick={() =>
    addToCart({
      id: 3,
      name: "Urban Runner Sneakers",
      price: 129,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80"
    })
  }
  className="w-full bg-white text-black border-t text-sm py-2"
>
  Add to Cart
</Button>
</div>

{/* Product 4 */}
<div className="group w-full flex flex-col border border-gray-200 overflow-hidden">
  <Link className="block flex-1" href="product.html">
    <div className="w-full aspect-[3/4] bg-gray-100 relative overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=500&q=80"
        alt="Leather Crossbody Bag"
        className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
      />
      {/* Optional SALE badge */}
      {/* <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1">
        SALE
      </span> */}
    </div>

    <h3 className="mt-2 text-xs text-slate-700 font-medium group-hover:text-green-600 px-2">
      Leather Crossbody Bag
    </h3>

    <div className="flex items-center gap-2 mt-1 px-2">
      <p className="text-text-base font-semibold text-slate-900">$89.00</p>
      {/* Optional old price */}
      {/* <p className="text-xs text-slate-400 line-through">$119.00</p> */}
    </div>
  </Link>

 <Button
  onClick={() =>
    addToCart({
      id: 4,
      name: "Leather Crossbody Bag",
      price: 89,
      image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=500&q=80"
    })
  }
  className="w-full bg-white text-black border-t text-sm py-2"
>
  Add to Cart
</Button>
</div>

  {/* Product 5 */}
<div className="group w-full flex flex-col border border-gray-200 overflow-hidden">
  <Link className="block flex-1" href="product.html">
    <div className="w-full aspect-[3/4] bg-gray-100 relative overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=500&q=80"
        alt="Polaroid Instant Camera"
        className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
      />
      {/* Optional SALE badge */}
      {/* <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1">
        SALE
      </span> */}
    </div>

    <h3 className="mt-2 text-xs text-slate-700 font-medium group-hover:text-green-600 px-2">
      Polaroid Instant Camera
    </h3>

    <div className="flex items-center gap-2 mt-1 px-2">
      <p className="text-text-base font-semibold text-slate-900">$99.00</p>
      {/* Optional old price */}
      {/* <p className="text-xs text-slate-400 line-through">$129.00</p> */}
    </div>
  </Link>

 <Button
  onClick={() =>
    addToCart({
      id: 5,
      name: "Polaroid Instant Camera",
      price: 99,
      image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=500&q=80"
    })
  }
  className="w-full bg-white text-black border-t text-sm py-2"
>
  Add to Cart
</Button>
</div>

{/* Product 6 */}
<div className="group w-full flex flex-col border border-gray-200 overflow-hidden">
  <Link className="block flex-1" href="product.html">
    <div className="w-full aspect-[3/4] bg-gray-100 relative overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=500&q=80"
        alt="Ceramic Plant Pot"
        className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
      />
      {/* Optional SALE badge */}
      {/* <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1">
        SALE
      </span> */}
    </div>

    <h3 className="mt-2 text-xs text-slate-700 font-medium group-hover:text-green-600 px-2">
      Ceramic Plant Pot
    </h3>

    <div className="flex items-center gap-2 mt-1 px-2">
      <p className="text-text-base font-semibold text-slate-900">$35.00</p>
      {/* Optional old price */}
      {/* <p className="text-xs text-slate-400 line-through">$50.00</p> */}
    </div>
  </Link>

 <Button
  onClick={() =>
    addToCart({
      id: 6,
      name: "Ceramic Plant Pot",
      price: 35,
      image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=500&q=80"
    })
  }
  className="w-full bg-white text-black border-t text-sm py-2"
>
  Add to Cart
</Button>
</div>
</div>
</div>
  {/* Pagination */}
              <div className="mt-12 flex justify-center">
                <nav className="flex items-center gap-2">
                  <Link contentKey="cta_21" className="w-10 h-10 flex items-center justify-center  border border-slate-300 text-slate-500 hover:bg-slate-50" href="#"> ← </Link>
                  <Link contentKey="cta_22" className="w-10 h-10 flex items-center justify-center  border bg-orange-600 text-white font-bold" href="#"> 1 </Link>
                  <Link contentKey="cta_23" className="w-10 h-10 flex items-center justify-center  border border-slate-300 text-slate-700 hover:bg-slate-50" href="#"> 2 </Link>
                  <Link contentKey="cta_24" className="w-10 h-10 flex items-center justify-center  border border-slate-300 text-slate-700 hover:bg-slate-50" href="#"> 3 </Link>
                  <Text className="text-slate-400"> ... </Text>
                  <Link contentKey="cta_25" className="w-10 h-10 flex items-center justify-center  border border-slate-300 text-slate-700 hover:bg-slate-50" href="#"> 8 </Link>
                  <Link contentKey="cta_26" className="w-10 h-10 flex items-center justify-center  border border-slate-300 text-slate-500 hover:bg-slate-50" href="#"> → </Link>
                </nav>
              </div>
            </div>
          </div>
        </main>
<Footer />
      </>
    </div>
  );
};


