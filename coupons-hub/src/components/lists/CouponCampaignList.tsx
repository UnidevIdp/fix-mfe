import React from 'react';
import { format } from 'date-fns';
import { Calendar, Target, TrendingUp, Edit2, Trash2 } from 'lucide-react';
import { CouponCampaign, CampaignStatus } from '../../types/coupon.types';
import { useCouponCampaigns } from '../../hooks/useCoupons';

interface CouponCampaignListProps {
  onEdit?: (campaign: CouponCampaign) => void;
  onDelete?: (id: string) => void;
}

export default function CouponCampaignList({ onEdit, onDelete }: CouponCampaignListProps) {
  const { campaigns, loading, error } = useCouponCampaigns();

  const getStatusColor = (status: CampaignStatus) => {
    switch (status) {
      case CampaignStatus.ACTIVE:
        return 'bg-green-100 text-green-800';
      case CampaignStatus.SCHEDULED:
        return 'bg-yellow-100 text-yellow-800';
      case CampaignStatus.ENDED:
        return 'bg-gray-100 text-gray-800';
      case CampaignStatus.PAUSED:
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load campaigns</p>
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No campaigns found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {campaigns.map((campaign) => (
        <div key={campaign.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(campaign.status)}`}>
                  {campaign.status}
                </span>
              </div>
              
              {campaign.description && (
                <p className="text-gray-600 mb-3">{campaign.description}</p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {format(new Date(campaign.startDate), 'MMM dd')} - 
                    {format(new Date(campaign.endDate), 'MMM dd, yyyy')}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-500">
                  <Target className="w-4 h-4" />
                  <span>Target: {campaign.targetAudience || 'All users'}</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-500">
                  <TrendingUp className="w-4 h-4" />
                  <span>
                    {campaign.couponsCount || 0} coupons, 
                    {campaign.totalRedemptions || 0} redemptions
                  </span>
                </div>
              </div>

              {campaign.budget && (
                <div className="mt-3 flex items-center gap-4">
                  <div className="text-sm">
                    <span className="text-gray-500">Budget:</span>
                    <span className="ml-1 font-medium">${campaign.budget.toLocaleString()}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Spent:</span>
                    <span className="ml-1 font-medium">
                      ${(campaign.spentAmount || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ 
                          width: `${Math.min(100, ((campaign.spentAmount || 0) / campaign.budget) * 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 ml-4">
              {onEdit && (
                <button
                  onClick={() => onEdit(campaign)}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(campaign.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}