
import { FC } from 'react';
import { LicenseCertification } from './license_certification';
import { useMonthYear } from './licenses_certrifications.init';

const LicenseCertificationItem: FC<{ item: LicenseCertification; index: number }> = ({ item }) => {
  const hasLink = Boolean(item.link?.trim());
  const getMonthYear = useMonthYear();
  const monthYearStr = getMonthYear(item.date);
  const Tag = hasLink ? 'a' : 'div';

  return (
    <li>
      <Tag
        href={hasLink ? item.link : undefined}
        rel={hasLink ? 'noopener noreferrer' : undefined}
        className="block rounded-lg px-4 py-2 transition-colors hover:bg-app-surface-alt hover:no-underline"
      >
        <div className="flex items-center gap-3">
          <div className="shrink-0 text-left">
            <img
              src={item.icon}
              alt="license icon"
              className="h-[25px] w-[30px] rounded bg-app-icon-bg shadow-[0_1px_4px_var(--app-shadow)]"
            />
          </div>
          <div className="w-9/12 text-left md:w-5/12">
            <h5 className="mb-0 text-xl max-sm:text-base max-sm:font-normal">{item.name}</h5>
          </div>
          <div className="hidden flex-1 pl-0 text-left sm:block">
            {item.institution}
          </div>
          <div className="hidden shrink-0 pr-12 text-right sm:block">
            <h5 className="mb-0 text-xl">{monthYearStr}</h5>
          </div>
        </div>
      </Tag>
    </li>
  );
};

export default LicenseCertificationItem;
