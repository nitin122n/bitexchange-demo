'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Card from '@/components/Card';

interface RiskSetting {
  maxDrawdown: number;
  leverageCap?: number;
  maxPositionPct: number;
  maxConcurrentTrades?: number;
  maxDailyVolume?: number;
  autoCopyEnabled: boolean;
}

interface TraderRiskOverride {
  traderId: string;
  traderName: string;
  maxSize?: number;
  riskPct?: number;
  enabled: boolean;
}

export default function RiskManagementPage() {
  const [riskSettings, setRiskSettings] = useState<RiskSetting>({
    maxDrawdown: 0.2,
    maxPositionPct: 0.1,
    maxConcurrentTrades: 5,
    autoCopyEnabled: true,
  });
  const [traderOverrides, setTraderOverrides] = useState<TraderRiskOverride[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchRiskSettings();
  }, []);

  const fetchRiskSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/trading/risk', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setRiskSettings(data.settings || riskSettings);
        setTraderOverrides(data.traderOverrides || []);
      }
    } catch (error) {
      console.error('Failed to fetch risk settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/trading/risk', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          settings: riskSettings,
          traderOverrides,
        }),
      });

      if (response.ok) {
        alert('Risk settings saved successfully!');
      }
    } catch (error) {
      console.error('Failed to save risk settings:', error);
      alert('Failed to save risk settings');
    } finally {
      setIsSaving(false);
    }
  };

  const applyPreset = (preset: 'conservative' | 'balanced' | 'aggressive') => {
    switch (preset) {
      case 'conservative':
        setRiskSettings({
          maxDrawdown: 0.1,
          leverageCap: 1,
          maxPositionPct: 0.05,
          maxConcurrentTrades: 3,
          maxDailyVolume: 1000,
          autoCopyEnabled: true,
        });
        break;
      case 'balanced':
        setRiskSettings({
          maxDrawdown: 0.2,
          leverageCap: 2,
          maxPositionPct: 0.1,
          maxConcurrentTrades: 5,
          maxDailyVolume: 5000,
          autoCopyEnabled: true,
        });
        break;
      case 'aggressive':
        setRiskSettings({
          maxDrawdown: 0.3,
          leverageCap: 5,
          maxPositionPct: 0.2,
          maxConcurrentTrades: 10,
          maxDailyVolume: 10000,
          autoCopyEnabled: true,
        });
        break;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg className="w-6 h-6 text-royal-purple-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            <h1 className="text-2xl font-bold text-muted-gray-900">Risk Management</h1>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="btn-primary disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

        {/* Presets */}
        <Card>
          <h3 className="text-lg font-semibold text-muted-gray-900 mb-4">Quick Presets</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => applyPreset('conservative')}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors text-left"
            >
              <h4 className="font-semibold mb-2">Conservative</h4>
              <p className="text-sm text-muted-gray-600">
                Low risk: 10% max drawdown, 5% max position
              </p>
            </button>
            <button
              onClick={() => applyPreset('balanced')}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors text-left"
            >
              <h4 className="font-semibold mb-2">Balanced</h4>
              <p className="text-sm text-muted-gray-600">
                Medium risk: 20% max drawdown, 10% max position
              </p>
            </button>
            <button
              onClick={() => applyPreset('aggressive')}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors text-left"
            >
              <h4 className="font-semibold mb-2">Aggressive</h4>
              <p className="text-sm text-muted-gray-600">
                High risk: 30% max drawdown, 20% max position
              </p>
            </button>
          </div>
        </Card>

        {/* Global Risk Settings */}
        <Card>
          <h3 className="text-lg font-semibold text-muted-gray-900 mb-4">Global Risk Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-gray-700 mb-2">
                Max Drawdown Threshold (%)
              </label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={riskSettings.maxDrawdown}
                onChange={(e) => setRiskSettings({ ...riskSettings, maxDrawdown: parseFloat(e.target.value) })}
                className="input-field"
              />
              <p className="text-xs text-muted-gray-500 mt-1">
                Auto-copy will stop if drawdown exceeds this threshold
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-gray-700 mb-2">
                Leverage Cap
              </label>
              <input
                type="number"
                min="1"
                value={riskSettings.leverageCap || ''}
                onChange={(e) => setRiskSettings({ ...riskSettings, leverageCap: parseFloat(e.target.value) || undefined })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-gray-700 mb-2">
                Max Position Size (% of Capital)
              </label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={riskSettings.maxPositionPct}
                onChange={(e) => setRiskSettings({ ...riskSettings, maxPositionPct: parseFloat(e.target.value) })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-gray-700 mb-2">
                Max Concurrent Trades
              </label>
              <input
                type="number"
                min="1"
                value={riskSettings.maxConcurrentTrades || ''}
                onChange={(e) => setRiskSettings({ ...riskSettings, maxConcurrentTrades: parseInt(e.target.value) || undefined })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-gray-700 mb-2">
                Max Daily Volume ($)
              </label>
              <input
                type="number"
                min="0"
                value={riskSettings.maxDailyVolume || ''}
                onChange={(e) => setRiskSettings({ ...riskSettings, maxDailyVolume: parseFloat(e.target.value) || undefined })}
                className="input-field"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={riskSettings.autoCopyEnabled}
                  onChange={(e) => setRiskSettings({ ...riskSettings, autoCopyEnabled: e.target.checked })}
                  className="w-4 h-4 text-royal-purple-600 rounded focus:ring-royal-purple-500"
                />
                <span className="text-sm font-medium text-muted-gray-700">Enable Auto-Copy</span>
              </label>
            </div>
          </div>
        </Card>

        {/* Per-Trader Overrides */}
        <Card>
          <h3 className="text-lg font-semibold text-muted-gray-900 mb-4">Per-Trader Risk Overrides</h3>
          {traderOverrides.length === 0 ? (
            <p className="text-muted-gray-500">No trader-specific overrides configured</p>
          ) : (
            <div className="space-y-4">
              {traderOverrides.map((override) => (
                <div key={override.traderId} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{override.traderName}</h4>
                    <label className="flex items-center space-x-2">
                      <span className="text-sm">Enabled</span>
                      <input
                        type="checkbox"
                        checked={override.enabled}
                        onChange={(e) => {
                          setTraderOverrides(prev =>
                            prev.map(o => o.traderId === override.traderId ? { ...o, enabled: e.target.checked } : o)
                          );
                        }}
                        className="w-4 h-4"
                      />
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-muted-gray-600 mb-1">Max Size</label>
                      <input
                        type="number"
                        value={override.maxSize || ''}
                        onChange={(e) => {
                          setTraderOverrides(prev =>
                            prev.map(o => o.traderId === override.traderId ? { ...o, maxSize: parseFloat(e.target.value) || undefined } : o)
                          );
                        }}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-muted-gray-600 mb-1">Risk %</label>
                      <input
                        type="number"
                        min="0"
                        max="1"
                        step="0.01"
                        value={override.riskPct || ''}
                        onChange={(e) => {
                          setTraderOverrides(prev =>
                            prev.map(o => o.traderId === override.traderId ? { ...o, riskPct: parseFloat(e.target.value) || undefined } : o)
                          );
                        }}
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
}

