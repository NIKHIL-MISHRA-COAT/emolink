import React, { useEffect, useState } from "react";
import "./preloader.css"; 

import Logo from "../Images/Logo.png"

const LogoPreloader = () => {
  return (
    <div className="logo-preloader">
      <div id="emolink" class="box">
    <span class="letter">E</span>
    <span class="letter">m</span>

    <div class="emolinkCircle box">
        <div class="emolinkInner box">
            <div class="emolinkCore box"></div>
        </div>
    </div>

    <span class="letter box"></span>
    <span class="letter box">L</span>
    <span class="letter box">i</span>
    <span class="letter box">n</span>
    <span class="letter box">K</span>
</div>

    </div>
  );
};

export default LogoPreloader;
