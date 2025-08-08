import Image from "next/image";
import React from "react";
const layout = ({children}:{children:React.ReactNode}) => {
  return (
    <div className="min-h-screen">
        <section>
          <div>
            <Image src=""}/>
          </div>
        </section>
        {children}
    </div>
  )
}
export default layout