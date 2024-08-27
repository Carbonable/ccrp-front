import { SanityTab } from "@/utils/sanity/types";
import { Tab, Tabs } from "@nextui-org/react";
import { PortableText } from "@portabletext/react";
import { useState } from "react";

export default function TabsWrapper({tabs}: {tabs: SanityTab[]}) {
  const [readMore, setReadMore] = useState(true);
  const components = {
    types: {
      break: ({value}: any) => {
        const style = value.style;
        if (style === "lineBreak") {
          return <br />;
        }
        if (readMore && style === "readMore") {
          return (
            <div className="readMore">
              <button onClick={() => setReadMore(false)}>Read More</button>
            </div>
          );
        }
        return null;
      }
    },
    marks: {
        greenText: ({ children }: any) => <span className="text-green">{children}</span>,
    }
  }

  return (
    <div className="w-full overflow-hidden">
      <Tabs variant="underlined" color="success" className="w-full">
        {tabs.map((tab, index) => (
          <Tab key={`tab_${index}`} title={tab.title} className="flex items-start">
            <div className={`${tab.mapURL ? "w-full xl:w-1/2" : "w-full"} overflow-auto whitespace-break-spaces`}>
              <PortableText value={tab.paragraph} components={components} />
            </div>
            <div className={tab.mapURL ? "w-full mt-4 xl:w-1/2 xl:pl-12 xl:mt-0 md:h-[500px] md:min-h-[500px]" : "w-0"}>
              <iframe title="project map" src={tab.mapURL} width="100%" height="100%" className="rounded-lg" allowFullScreen={true} loading="lazy"></iframe>
            </div>
          </Tab>
        ))}
      </Tabs>
    </div>
  )
}