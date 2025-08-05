'use client';

import React from 'react';
import { useStore } from '@/store/useStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ColorRule, DataSource } from '@/types';
import { Plus, Trash2, Database } from 'lucide-react';
import { generateId } from '@/lib/utils';

export function DataSourcePanel() {
  const { dataSources, updateDataSource } = useStore();

  const addColorRule = (dataSourceId: string) => {
    const dataSource = dataSources.find(ds => ds.id === dataSourceId);
    if (!dataSource) return;

    const newRule: ColorRule = {
      id: generateId(),
      operator: '>',
      value: 0,
      color: '#3B82F6',
      label: 'New Rule'
    };

    updateDataSource(dataSourceId, {
      colorRules: [...dataSource.colorRules, newRule]
    });
  };

  const updateColorRule = (dataSourceId: string, ruleId: string, updates: Partial<ColorRule>) => {
    const dataSource = dataSources.find(ds => ds.id === dataSourceId);
    if (!dataSource) return;

    const updatedRules = dataSource.colorRules.map(rule =>
      rule.id === ruleId ? { ...rule, ...updates } : rule
    );

    updateDataSource(dataSourceId, { colorRules: updatedRules });
  };

  const removeColorRule = (dataSourceId: string, ruleId: string) => {
    const dataSource = dataSources.find(ds => ds.id === dataSourceId);
    if (!dataSource) return;

    const updatedRules = dataSource.colorRules.filter(rule => rule.id !== ruleId);
    updateDataSource(dataSourceId, { colorRules: updatedRules });
  };

  return (
    <div className="space-y-4">
      {dataSources.map((dataSource) => (
        <Card key={dataSource.id} className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-5 h-5" />
            <h3 className="text-lg font-semibold">{dataSource.name}</h3>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor={`field-${dataSource.id}`}>Data Field</Label>
              <Input
                id={`field-${dataSource.id}`}
                value={dataSource.field}
                onChange={(e) => updateDataSource(dataSource.id, { field: e.target.value })}
                placeholder="e.g., temperature_2m"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Color Rules</Label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addColorRule(dataSource.id)}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Rule
                </Button>
              </div>

              <div className="space-y-2">
                {dataSource.colorRules.map((rule) => (
                  <div key={rule.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <Select
                      value={rule.operator}
                      onValueChange={(value: ColorRule['operator']) =>
                        updateColorRule(dataSource.id, rule.id, { operator: value })
                      }
                    >
                      <SelectTrigger className="w-16">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="<">&lt;</SelectItem>
                        <SelectItem value="<=">&le;</SelectItem>
                        <SelectItem value="=">=</SelectItem>
                        <SelectItem value=">=">&ge;</SelectItem>
                        <SelectItem value=">">&gt;</SelectItem>
                      </SelectContent>
                    </Select>

                    <Input
                      type="number"
                      value={rule.value}
                      onChange={(e) =>
                        updateColorRule(dataSource.id, rule.id, { value: parseFloat(e.target.value) })
                      }
                      className="w-20"
                      placeholder="Value"
                    />

                    <div className="flex items-center gap-1">
                      <input
                        type="color"
                        value={rule.color}
                        onChange={(e) =>
                          updateColorRule(dataSource.id, rule.id, { color: e.target.value })
                        }
                        className="w-8 h-8 border rounded"
                      />
                    </div>

                    <Input
                      value={rule.label}
                      onChange={(e) =>
                        updateColorRule(dataSource.id, rule.id, { label: e.target.value })
                      }
                      placeholder="Label"
                      className="flex-1"
                    />

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeColorRule(dataSource.id, rule.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}