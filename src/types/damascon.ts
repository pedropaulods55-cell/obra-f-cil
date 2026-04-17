export interface Milestone {
    id: string;
    title: string;
    status: 'pending' | 'in-progress' | 'completed';
    dueDate: string;
    description: string;
}

export interface Budget {
    category: string;
    estimated: number;
    actual: number;
}

export interface InvestmentMetrics {
    expectedReturn: number;
    retentionPeriodMonths: number;
    riskLevel: 'low' | 'medium' | 'high';
    netProfit: number;
    roiHistory?: { date: string; value: number }[];
}

export interface Project {
    id: string;
    name: string;
    location: string;
    coordinates: { lat: number; lng: number };
    status: 'planning' | 'active' | 'on-hold' | 'completed';
    progress: number;
    startDate: string;
    endDate: string;
    totalBudget: number;
    spentBudget: number;
    description: string;
    imageUrl: string;
    milestones: Milestone[];
    budgets: Budget[];
    metrics?: InvestmentMetrics;
    aiAnalysis?: string;
}

export interface InvestmentOpportunity {
    id: string;
    title: string;
    type: 'terrain' | 'property';
    location: string;
    coordinates: { lat: number; lng: number };
    price: number;
    areaSize: number;
    sourceUrl: string;
    sourceName: string;
    sourceLogoUrl?: string;
    expectedROI: number;
    potentialProfit: number;
    timeframeMonths: number;
    imageUrl: string;
    status: 'available' | 'analyzing' | 'premium';
    validationScore?: number;
    validationNotes?: string;
}