import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../shared/entities/BaseEntity';

@Entity('content')
export class Content extends BaseEntity {
    @Column()
    title: string;

    @Column()
    type: 'movie' | 'tv_show';

    @Column()
    description: string;

    @Column('simple-array')
    genres: string[];

    @Column('simple-array')
    regions: string[];

    @Column()
    releaseYear: number;

    @Column()
    duration: number; // in minutes

    @Column()
    rating: string; // e.g., 'PG-13', 'R', etc.

    @Column('simple-json')
    metadata: {
        director?: string;
        cast?: string[];
        language?: string;
        subtitles?: string[];
        awards?: string[];
    };
} 