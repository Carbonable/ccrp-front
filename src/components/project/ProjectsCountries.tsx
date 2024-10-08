import { LocalizationRepartition } from '@/graphql/__generated__/graphql';
import { getNumericPercentage } from '@/utils/utils';
import { SmallTitle } from '../common/Title';

export default function ProjectsCountries({ countries }: { countries: LocalizationRepartition[] }) {
  let countriesToSort = [...countries];
  countriesToSort.sort((a, b) => {
    const bValue = getNumericPercentage(b.value);
    const aValue = getNumericPercentage(a.value);
    return bValue - aValue;
  });

  return (
    <div>
      <SmallTitle title="Projects Countries" />
      <div className="h-full w-full md:mt-4 md:max-h-[420px] md:overflow-x-scroll">
        {countriesToSort.map((country, index) => (
          <ProjectCountriesDetails key={index} country={country} />
        ))}
      </div>
    </div>
  );
}

function ProjectCountriesDetails({ country }: { country: LocalizationRepartition }) {
  return (
    <div className="mt-8 flex w-full justify-start px-4">
      <div className="text-4xl">{country.country.flag}</div>
      <div className="w-full pl-4">
        <div className="font-inter text-sm text-neutral-300">{country.country.name}</div>
        <div className="mt-1 flex items-center">
          <div className="h-2 w-full rounded-full bg-opacityLight-5">
            <div
              className="h-2 rounded-full bg-greenish-700"
              style={{ width: `${getNumericPercentage(country.value)}%` }}
            ></div>
          </div>
          <div className="font-inter ml-3 text-xs text-neutral-300">
            {getNumericPercentage(country.value)}%
          </div>
        </div>
      </div>
    </div>
  );
}
