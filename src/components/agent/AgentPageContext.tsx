'use client';

import { useEffect } from 'react';
import { useAgent } from '@/components/agent/AgentProvider';
import type { AgentSelectedEntities } from '@/lib/agent/types';

export default function AgentPageContext({
  entities,
}: {
  entities: Partial<AgentSelectedEntities>;
}) {
  const { registerEntities } = useAgent();

  useEffect(() => {
    registerEntities(entities);
  }, [entities, registerEntities]);

  return null;
}
