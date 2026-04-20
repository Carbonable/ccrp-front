'use client';

import { NET_ZERO_PLANNING } from '@/graphql/queries/net-zero';
import { useQuery } from '@apollo/client/react';
import { useCompanyId } from '@/hooks/useCompanyId';
import ProjectDecarbonationComponent from '../net-zero/ProjectDecarbonation';

export default function ProjectDecarbonation({ isFullScreen }: { isFullScreen: boolean }) {
  const companyId = useCompanyId();
  const { loading, error, data, refetch } = useQuery<any>(NET_ZERO_PLANNING, {
    variables: {
      view: {
        company_id: companyId,
      },
    },
  });

  return (
    <ProjectDecarbonationComponent
      isFullScreen={isFullScreen}
      loading={loading}
      error={error}
      data={data}
      refetch={refetch}
    />
  );
}
