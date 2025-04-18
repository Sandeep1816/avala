'use client';

import React from 'react';
import EditProductForm from './EditProductForm';

interface PageProps {
  params: {
    id: string;
  };
}

export default function EditProductPage({ params }: PageProps) {
  return <EditProductForm productId={params.id} />;
} 