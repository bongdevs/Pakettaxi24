
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

interface RatingInputProps {
    onRate: (rating: number) => void;
}

export const RatingInput = ({ onRate }: RatingInputProps) => {
    const [hoverRating, setHoverRating] = useState(0);

    return (
        <div className="rating-input">
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    className="material-symbols-outlined"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => onRate(star)}
                    title={`Rate ${star} star${star > 1 ? 's' : ''}`}
                    style={{ fontVariationSettings: `'FILL' ${star <= hoverRating ? 1 : 0}` }}
                >
                    star
                </span>
            ))}
        </div>
    );
};