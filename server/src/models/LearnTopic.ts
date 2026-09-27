import mongoose, { Schema, Document } from 'mongoose';
import { ILearnTopic } from '@oruvia/shared';

export interface ILearnTopicDocument extends Omit<ILearnTopic, '_id'>, Document {}

const LearnTopicSchema = new Schema<ILearnTopicDocument>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, index: true },
    category: { 
      type: String, 
      enum: [
        'Polar regions', 'Climate', 'Ice', 'Oceans', 'Expeditions', 'People', 'Glossary',
        'Glaciology', 'Oceanography', 'Atmospheric Science', 'Marine Biology', 'Ecology',
        'Earth Science', 'Polar Science', 'Remote Sensing', 'Biodiversity', 'Geophysics',
      ], 
      required: true,
      index: true 
    },
    summary: { type: String, required: true },
    heroImageUrl: { type: String, required: true },
    readingTimeMin: { type: Number, default: 5 },
    interactiveExplainer: {
      title: { type: String, required: true },
      description: { type: String, required: true },
      steps: [
        {
          stepNumber: { type: Number, required: true },
          title: { type: String, required: true },
          text: { type: String, required: true },
          diagramType: { type: String },
          dataHighlight: { type: String },
        },
      ],
    },
    quiz: [
      {
        question: { type: String, required: true },
        options: [{ type: String }],
        correctIndex: { type: Number, required: true },
        explanation: { type: String, required: true },
      },
    ],
    glossaryTerms: [
      {
        term: { type: String, required: true },
        definition: { type: String, required: true },
        domain: { type: String, required: true },
      },
    ],
    featuredScientist: {
      name: { type: String },
      title: { type: String },
      bio: { type: String },
      focus: { type: String },
      imageUrl: { type: String },
    },
  },
  { timestamps: true }
);

export const LearnTopic = mongoose.model<ILearnTopicDocument>('LearnTopic', LearnTopicSchema);
