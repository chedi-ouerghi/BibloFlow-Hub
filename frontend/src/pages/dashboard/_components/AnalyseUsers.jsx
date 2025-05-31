import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { motion } from 'framer-motion';

const AnalyseUsers = ({ users }) => {
  // Calcul des statistiques
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.isActive && !u.estBanni && !u.estVerrouille).length;
  const bannedUsers = users.filter(u => u.estBanni).length;
  const lockedUsers = users.filter(u => u.estVerrouille).length;

  // Données pour le graphique de statut
  const statutData = [
    { name: 'Actifs', value: activeUsers },
    { name: 'Bannis', value: bannedUsers },
    { name: 'Verrouillés', value: lockedUsers },
  ];

  // Données pour le graphique des avertissements
  const avertissementsData = users
    .filter(user => user.nombreAvertissements > 0)
    .sort((a, b) => b.nombreAvertissements - a.nombreAvertissements)
    .slice(0, 5)
    .map(user => ({
      name: user.username,
      avertissements: user.nombreAvertissements,
    }));

  // Données pour le graphique d'activité (dernière connexion)
  const today = new Date();
  const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const recentLogins = users.filter(user => new Date(user.lastLogin) > sevenDaysAgo).length;
  const inactiveUsers = totalUsers - recentLogins;

  const activiteData = [
    { name: 'Actifs 7j', value: recentLogins },
    { name: 'Inactifs', value: inactiveUsers },
  ];

  // Couleurs pour les pie charts
  const COLORS = ['#4f46e5', '#ef4444', '#fbbf24', '#10b981'];

  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerAnimation}
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 p-4"
    >
      {/* Vue d'ensemble */}
      <motion.div variants={itemAnimation} className="xl:col-span-4">
        <Card className="bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Vue d'ensemble des utilisateurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                <p className="text-3xl font-bold text-indigo-600">{totalUsers}</p>
                <p className="text-sm font-medium text-gray-600">Total utilisateurs</p>
              </div>
              <div className="p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                <p className="text-3xl font-bold text-green-500">{activeUsers}</p>
                <p className="text-sm font-medium text-gray-600">Utilisateurs actifs</p>
              </div>
              <div className="p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                <p className="text-3xl font-bold text-red-500">{bannedUsers}</p>
                <p className="text-sm font-medium text-gray-600">Utilisateurs bannis</p>
              </div>
              <div className="p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                <p className="text-3xl font-bold text-yellow-500">{lockedUsers}</p>
                <p className="text-sm font-medium text-gray-600">Comptes verrouillés</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Distribution des statuts */}
      <motion.div variants={itemAnimation} className="xl:col-span-2">
        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Distribution des Statuts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statutData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statutData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]}
                        className="hover:opacity-80 transition-opacity"
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Activité des utilisateurs */}
      <motion.div variants={itemAnimation} className="xl:col-span-2">
        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Activité des Utilisateurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={activiteData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {activiteData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={[COLORS[0], COLORS[1]][index]}
                        className="hover:opacity-80 transition-opacity"
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Top des avertissements */}
      <motion.div variants={itemAnimation} className="xl:col-span-4">
        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Top 5 des Utilisateurs avec le Plus d'Avertissements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={avertissementsData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="avertissements" 
                    fill="#ef4444"
                    radius={[4, 4, 0, 0]}
                    className="hover:opacity-80 transition-opacity"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default AnalyseUsers;