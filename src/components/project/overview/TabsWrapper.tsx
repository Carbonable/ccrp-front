'use client';

import { SanityTab } from '@/utils/sanity/types';
import { PortableText } from '@portabletext/react';
import { useState } from 'react';
import { classNames } from '@/utils/utils';

export default function TabsWrapper({ tabs }: { tabs: SanityTab[] }) {
  const [readMore, setReadMore] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeTab = tabs[activeIndex];

  const components = {
    types: {
      break: ({ value }: any) => {
        const style = value.style;
        if (style === 'lineBreak') {
          return <br />;
        }
        if (readMore && style === 'readMore') {
          return (
            <div className="readMore">
              <button onClick={() => setReadMore(false)}>Read More</button>
            </div>
          );
        }
        return null;
      },
    },
    marks: {
      greenText: ({ children }: any) => <span className="text-green">{children}</span>,
    },
  };

  if (!activeTab) return null;

  return (
    <div className="w-full overflow-hidden">
      <div className="mb-6 flex flex-wrap gap-2 border-b border-neutral-800 pb-3">
        {tabs.map((tab, index) => (
          <button
            key={`tab_${index}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={classNames(
              'rounded-xl border px-4 py-2 text-sm transition',
              index === activeIndex
                ? 'border-primary/40 bg-primary/10 text-primary'
                : 'border-neutral-800 bg-neutral-900 text-neutral-300 hover:border-neutral-700 hover:text-white',
            )}
          >
            {tab.title}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
        <div
          className={`${activeTab.mapURL ? 'w-full xl:w-1/2' : 'w-full'} overflow-auto whitespace-break-spaces`}
        >
          <PortableText value={activeTab.paragraph} components={components} />
        </div>
        {activeTab.mapURL ? (
          <div className="w-full md:h-[500px] md:min-h-[500px] xl:w-1/2 xl:pl-12">
            <iframe
              title="project map"
              src={activeTab.mapURL}
              width="100%"
              height="100%"
              className="rounded-lg"
              allowFullScreen={true}
              loading="lazy"
            ></iframe>
          </div>
        ) : null}
      </div>
    </div>
  );
}
