/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DropoffPoint } from '../../data/types';

interface PointsBadgeWithTooltipProps {
    points: DropoffPoint[];
}

export const PointsBadgeWithTooltip = ({ points }: PointsBadgeWithTooltipProps) => {
  if (!points || points.length === 0) {
    return <span>0 points</span>;
  }
  return (
    <div className="tooltip-container">
      <span className="points-badge">
        <span className="material-symbols-outlined">fmd_good</span>
        {points.length} point{points.length !== 1 ? 's' : ''}
      </span>
      <div className="custom-tooltip">
        <ul>
          {points.map(p => <li key={p.id}>{p.address}</li>)}
        </ul>
      </div>
    </div>
  );
};