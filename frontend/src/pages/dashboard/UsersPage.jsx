import { useEffect, useState } from 'react';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { useToast } from '../../components/ui/use-toast';
import DialogAvertissement from './_components/DialogAvertissement';
import AnalyseUsers from './_components/AnalyseUsers';
import PendingAuthors from './_components/PendingAuthors';
import { AlertTriangle, Users } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip';
import { adminApi } from '../../api/adminapi';

const UsersPage = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAvertissementDialogOpen, setIsAvertissementDialogOpen] = useState(false);
  const [pendingAuthors, setPendingAuthors] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des utilisateurs');
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingAuthors = async () => {
    try {
      const data = await adminApi.getPendingAuthors();
      setPendingAuthors(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message
      });
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchPendingAuthors();
  }, []);

  const handleAvertissementClick = (user) => {
    setSelectedUser(user);
    setIsAvertissementDialogOpen(true);
  };

  const handleAvertissementDialogClose = (refresh = false) => {
    setIsAvertissementDialogOpen(false);
    setSelectedUser(null);
    if (refresh) {
      fetchUsers();
    }
  };

  const handleValidateAuthor = async (authorId) => {
    try {
      await adminApi.validateAuthor(authorId, true);
      fetchPendingAuthors();
      fetchUsers();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message
      });
    }
  };

  const handleRejectAuthor = async (authorId) => {
    try {
      await adminApi.validateAuthor(authorId, false);
      fetchPendingAuthors();
      fetchUsers();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message
      });
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Users className="w-8 h-8 text-indigo-600" />
          <h1 className="text-2xl font-bold">Gestion des Utilisateurs</h1>
        </div>
      </div>

      <Tabs defaultValue="analyse" className="w-full">
        <TabsList>
          <TabsTrigger value="analyse">Analyse</TabsTrigger>
          <TabsTrigger value="pending">En attente</TabsTrigger>
          <TabsTrigger value="table">Table</TabsTrigger>
        </TabsList>
        
        <TabsContent value="analyse">
          <AnalyseUsers users={users} />
        </TabsContent>

        <TabsContent value="pending">
          <PendingAuthors
            authors={pendingAuthors}
            onValidate={handleValidateAuthor}
            onReject={handleRejectAuthor}
            onRefresh={() => {
              fetchPendingAuthors();
              fetchUsers();
            }}
          />
        </TabsContent>
        
        <TabsContent value="table">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom d'utilisateur</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôles</TableHead>
                  <TableHead>Avertissements</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {user.roles.map((role, index) => (
                          <Badge key={index} variant="secondary">
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.nombreAvertissements > 0 ? (
                        <Badge variant="destructive">
                          {user.nombreAvertissements}
                        </Badge>
                      ) : (
                        '0'
                      )}
                    </TableCell>
                    <TableCell>
                      {user.estBanni ? (
                        <Badge variant="destructive">Banni</Badge>
                      ) : user.estVerrouille ? (
                        <Badge variant="warning">Verrouillé</Badge>
                      ) : (
                        <Badge variant="success">Actif</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleAvertissementClick(user)}
                              >
                                <AlertTriangle className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Avertir l'utilisateur</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedUser && (
        <DialogAvertissement
          isOpen={isAvertissementDialogOpen}
          onClose={handleAvertissementDialogClose}
          user={selectedUser}
        />
      )}
    </div>
  );
};

export default UsersPage;