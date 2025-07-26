import React from 'react'
import "../Function.js"
import "../Main.css"

export const Theme = () => {
  return (
    <div className="customize-theme">
                <div className="card">
                    <h2>Customize your theme</h2>
                    <p>Manage your font size, color, and background</p>

                    <div className="font-size">
                        <h4>Font Size</h4>
                        <div>
                            <h5>Aa</h5>
                            <div className="choose-size">
                                <span className="font-size-1 active"></span>
                                <span className="font-size-2"></span>
                                <span className="font-size-3"></span>
                                <span className="font-size-4"></span>
                                <span className="font-size-5"></span>
                            </div>
                            <h3>Aa</h3>
                        </div>
                    </div>

                    <div className="color">
                        <h4>Color</h4>
                        <div className="choose-color">
                            <span className="color-1 active"></span>
                            <span className="color-2"></span>
                            <span className="color-3"></span>
                            <span className="color-4"></span>
                            <span className="color-5"></span>
                        </div>
                    </div>

                    <div className="background">
                        <h4>Background</h4>
                        <div className="choose-bg">
                            <div className="bg-1 active">
                                <span></span>
                                <h5 htmlFor="bg-1">Light</h5>
                            </div>
                            <div className="bg-2">
                                <span></span>
                                <h5 htmlFor="bg-2">Dim</h5>
                            </div>
                            <div className="bg-3">
                                <span></span>
                                <h5 htmlFor="bg-3">Lights out</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
  )
}
