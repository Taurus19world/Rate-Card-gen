import React, { useState } from 'react'; import { Card, CardContent } from "@/components/ui/card"; import { Button } from "@/components/ui/button"; import { Input } from "@/components/ui/input"; import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; import { Label } from "@/components/ui/label"; import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function RateCardGenerator() { const [profile, setProfile] = useState({ name: '', email: '', country: '', socialMediaLinks: '', followers: '', engagementRate: '', audienceLocation: '', platform: '', campaignType: '', previousDeals: '', currency: 'ZAR', });

const [ambassadorData, setAmbassadorData] = useState({ brandName: '', campaignDuration: '', performanceStats: '', });

const [price, setPrice] = useState(null);

const calculateRate = () => { const baseRate = parseInt(profile.followers) * (parseFloat(profile.engagementRate) / 100); let multiplier = 1; if (profile.campaignType === 'Reel') multiplier = 2; else if (profile.campaignType === 'Story') multiplier = 1.2; else if (profile.campaignType === 'Post') multiplier = 1.5; setPrice((baseRate * multiplier).toFixed(2)); };

const dummyChartData = [ { month: 'Jan', performance: 1200 }, { month: 'Feb', performance: 2100 }, { month: 'Mar', performance: 800 }, { month: 'Apr', performance: 1700 }, ];

return ( <div className="p-6 max-w-4xl mx-auto text-white"> <h1 className="text-3xl font-bold mb-4">Influencer Rate Card Generator</h1> <Tabs defaultValue="details"> <TabsList> <TabsTrigger value="details">Profile</TabsTrigger> <TabsTrigger value="rate">Rate Card</TabsTrigger> <TabsTrigger value="ambassador">Ambassadorship Tracker</TabsTrigger> <TabsTrigger value="dashboard">Dashboard</TabsTrigger> </TabsList>

<TabsContent value="details">
      <Card className="bg-gray-900 border-gray-700">
        <CardContent className="space-y-4 p-6">
          {Object.keys(profile).map(key => (
            key !== 'currency' && (
              <div key={key}>
                <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
                <Input 
                  className="bg-gray-800 border-gray-600" 
                  value={profile[key]} 
                  onChange={(e) => setProfile({ ...profile, [key]: e.target.value })} 
                />
              </div>
            )
          ))}
          <div>
            <Label>Currency</Label>
            <select 
              className="bg-gray-800 text-white border border-gray-600 rounded w-full p-2"
              value={profile.currency} 
              onChange={(e) => setProfile({ ...profile, currency: e.target.value })}>
              <option value="ZAR">ZAR (South Africa)</option>
              <option value="USD">USD (USA)</option>
              <option value="EUR">EUR (Europe)</option>
            </select>
          </div>
          <Button className="mt-4" onClick={calculateRate}>Generate Rate</Button>
        </CardContent>
      </Card>
    </TabsContent>

    <TabsContent value="rate">
      <Card className="bg-gray-900 border-gray-700 text-center">
        <CardContent className="p-6">
          {price ? (
            <div>
              <h2 className="text-2xl font-semibold">Estimated Rate:</h2>
              <p className="text-4xl mt-2">{profile.currency} {price}</p>
            </div>
          ) : (
            <p>Please fill out your details and generate your rate card.</p>
          )}
        </CardContent>
      </Card>
    </TabsContent>

    <TabsContent value="ambassador">
      <Card className="bg-gray-900 border-gray-700">
        <CardContent className="space-y-4 p-6">
          <h2 className="text-xl font-semibold mb-2">Ambassadorship Tracker</h2>
          <div>
            <Label>Brand Name</Label>
            <Input 
              className="bg-gray-800 border-gray-600" 
              value={ambassadorData.brandName} 
              onChange={(e) => setAmbassadorData({ ...ambassadorData, brandName: e.target.value })} 
            />
          </div>
          <div>
            <Label>Campaign Duration</Label>
            <Input 
              className="bg-gray-800 border-gray-600" 
              value={ambassadorData.campaignDuration} 
              onChange={(e) => setAmbassadorData({ ...ambassadorData, campaignDuration: e.target.value })} 
            />
          </div>
          <div>
            <Label>Performance Stats</Label>
            <Input 
              className="bg-gray-800 border-gray-600" 
              value={ambassadorData.performanceStats} 
              onChange={(e) => setAmbassadorData({ ...ambassadorData, performanceStats: e.target.value })} 
            />
          </div>
        </CardContent>
      </Card>
    </TabsContent>

    <TabsContent value="dashboard">
      <Card className="bg-gray-900 border-gray-700">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Performance Dashboard</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dummyChartData}>
              <defs>
                <linearGradient id="colorPerf" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Area type="monotone" dataKey="performance" stroke="#8884d8" fillOpacity={1} fill="url(#colorPerf)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </TabsContent>
  </Tabs>
</div>

); }

