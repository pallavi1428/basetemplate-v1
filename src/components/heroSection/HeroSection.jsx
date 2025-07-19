import React from "react";

const HeroSection = () => {
    return (
        <div className="relative flex lg:flex-row flex-col items-center justify-between px-4 lg:px-12 py-6 lg:py-0 bg-[#fdf8f2]">
            {/* Left Side - Hero Image */}
            <div className="w-full lg:w-1/2">
                <img
                    className="rounded-2xl shadow-lg w-full h-[400px] object-cover"
                    src="../img/hero1.jpg"
                    alt="Hero"
                />
            </div>

            {/* Right Side - Philosophy Image (Laptop Only) */}
            <img
                src="/img/Philosophy.png"
                alt="Philosophy"
                className="hidden lg:block max-h-[400px] object-contain"
            />
        </div>
    );
};

export default HeroSection;
