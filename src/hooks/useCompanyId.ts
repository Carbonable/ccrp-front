import { useOrganization } from '@clerk/nextjs';
import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';

const GET_COMPANY_BY_CLERK_ORG = gql`
  query CompanyByClerkOrg($clerkOrgId: String!) {
    companyByClerkOrg(clerkOrgId: $clerkOrgId) {
      id
      name
      slug
    }
  }
`;

export function useCompanyId(): string {
  const { organization } = useOrganization();
  const orgId = organization?.id;

  const { data } = useQuery<any>(GET_COMPANY_BY_CLERK_ORG, {
    variables: { clerkOrgId: orgId },
    skip: !orgId,
  });

  // Fallback to '1' (Carbonable) if no org or query not ready
  return data?.companyByClerkOrg?.id || '1';
}
