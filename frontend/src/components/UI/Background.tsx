import desktopDark from "@/assets/images/bg-desktop-dark.jpg";
import desktopLight from "@/assets/images/bg-desktop-light.jpg";
import mobileDark from "@/assets/images/bg-mobile-dark.jpg";
import mobileLight from "@/assets/images/bg-mobile-light.jpg";

import { ThemeContext } from "@/context/ThemeContext";
import { use } from "react";

export default function Background() {
  const { theme } = use(ThemeContext);

  return (
    <section>
      <picture>
        <source
          media="(max-width:768px)"
          srcSet={theme === "light" ? mobileLight : mobileDark}
          className="w-full"
        />
        <source media="(min-width:769px)" />
        <img
          src={theme === "light" ? desktopLight : desktopDark}
          alt="background image"
          className="w-full"
        />
      </picture>
    </section>
  );
}
