'use client';

import { useState, useEffect } from 'react';
import { Prefeitura, Department, createPrefeitura, createDepartment, getDepartmentsByPrefeitura, updateTenantIdentity } from '@/actions/configuracoes';

export function ConfigManager({ 
  initialPrefeituras, 
  accessLevel, 
  userPrefeituraId 
}: { 
  initialPrefeituras: Prefeitura[],
  accessLevel: number,
  userPrefeituraId?: string
}) {
  const isSystemAdmin = accessLevel === 5;
  const initialPref = isSystemAdmin ? '' : (userPrefeituraId || '');
  const [selectedPrefeitura, setSelectedPrefeitura] = useState<string>(initialPref);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingDepts, setLoadingDepts] = useState(false);

  const initialPrefObj = initialPrefeituras.find(p => p.id === initialPref);
  const [primaryColor, setPrimaryColor] = useState<string>(initialPrefObj?.primary_color || '#006a69');
  const [secondaryColor, setSecondaryColor] = useState<string>(initialPrefObj?.secondary_color || '#4fd8d5');

  useEffect(() => {
    const pref = initialPrefeituras.find(p => p.id === selectedPrefeitura);
    if (pref) {
      setPrimaryColor(pref.primary_color || '#006a69');
      setSecondaryColor(pref.secondary_color || '#4fd8d5');
    }
  }, [initialPrefeituras, selectedPrefeitura]);
  const handlePrefeituraChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pId = e.target.value;
    setSelectedPrefeitura(pId);
    
    const pref = initialPrefeituras.find(p => p.id === pId);
    if (pref) {
      setPrimaryColor(pref.primary_color || '#006a69');
      setSecondaryColor(pref.secondary_color || '#4fd8d5');
    } else {
      setPrimaryColor('#006a69');
      setSecondaryColor('#4fd8d5');
    }

    if (pId) {
      setLoadingDepts(true);
      const depts = await getDepartmentsByPrefeitura(pId);
      setDepartments(depts);
      setLoadingDepts(false);
    } else {
      setDepartments([]);
    }
  };

  const handleUpdateIdentity = async (formData: FormData) => {
    if (confirm('Deseja realmente atualizar a identidade visual?')) {
      const result = await updateTenantIdentity(formData);
      if (result && result.error) {
        alert('Erro: ' + result.error);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Coluna 1: Prefeituras / Identidade */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#e0e3e2] flex flex-col gap-8">
        
        {isSystemAdmin && (
          <div>
            <h3 className="text-xl font-semibold text-[#1b1c1c] mb-4">Adicionar Prefeitura</h3>
            <form action={createPrefeitura} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-[#3f4948] mb-1">Nome da Prefeitura</label>
                <input type="text" name="name" required className="w-full border border-[#e4e2e1] rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#006a69]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#3f4948] mb-1">Cor Primária (Hex)</label>
                  <input type="color" name="primary_color" defaultValue="#006a69" className="w-full h-10 border border-[#e4e2e1] rounded-md p-1 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#3f4948] mb-1">Cor Secundária (Hex)</label>
                  <input type="color" name="secondary_color" defaultValue="#4fd8d5" className="w-full h-10 border border-[#e4e2e1] rounded-md p-1 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#3f4948] mb-1">Logotipo (Upload)</label>
                <input type="file" name="logo" accept="image/*" className="w-full border border-[#e4e2e1] rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#006a69]" />
              </div>
              <button type="submit" className="mt-2 bg-[#006a69] text-white py-2 px-4 rounded-md font-semibold hover:bg-[#004d4c] transition-colors">
                Salvar Prefeitura
              </button>
            </form>

            <div className="mt-8">
              <h4 className="font-semibold text-[#1b1c1c] mb-2">Prefeituras Cadastradas</h4>
              <ul className="space-y-2 max-h-48 overflow-y-auto">
                {initialPrefeituras.map(p => (
                  <li key={p.id} className="text-sm bg-[#f6f3f2] p-2 rounded-md flex justify-between items-center">
                    <span>{p.name}</span>
                    {p.primary_color && <span className="w-4 h-4 rounded-full" style={{ backgroundColor: p.primary_color }}></span>}
                  </li>
                ))}
                {initialPrefeituras.length === 0 && <p className="text-sm text-[#8e8b8a]">Nenhuma prefeitura encontrada.</p>}
              </ul>
            </div>
          </div>
        )}

        {/* Identidade Visual */}
        <div>
          <h3 className="text-xl font-semibold text-[#1b1c1c] mb-4">Identidade Visual</h3>
          <form action={handleUpdateIdentity} className="flex flex-col gap-4">
            {isSystemAdmin ? (
              <div>
                <label className="block text-sm font-medium text-[#3f4948] mb-1">Selecione a Prefeitura</label>
                <select name="prefeitura_id" required value={selectedPrefeitura} onChange={handlePrefeituraChange} className="w-full border border-[#e4e2e1] rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#006a69]">
                  <option value="">-- Selecione --</option>
                  {initialPrefeituras.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            ) : (
              <input type="hidden" name="prefeitura_id" value={userPrefeituraId} />
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#3f4948] mb-1">Cor Primária (Hex)</label>
                <input type="color" name="primary_color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-full h-10 border border-[#e4e2e1] rounded-md p-1 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#3f4948] mb-1">Cor Secundária (Hex)</label>
                <input type="color" name="secondary_color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="w-full h-10 border border-[#e4e2e1] rounded-md p-1 focus:outline-none" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#3f4948] mb-1">Logotipo (Upload)</label>
              <input type="file" name="logo" accept="image/*" className="w-full border border-[#e4e2e1] rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#006a69]" />
            </div>

            <button type="submit" className="mt-2 bg-[#006a69] text-white py-2 px-4 rounded-md font-semibold hover:bg-[#004d4c] transition-colors">
              Atualizar Identidade
            </button>
          </form>
        </div>
      </div>

      {/* Coluna 2: Secretarias */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#e0e3e2]">
        <h3 className="text-xl font-semibold text-[#1b1c1c] mb-4">Adicionar Secretaria</h3>
        <form 
          action={async (formData) => {
            await createDepartment(formData);
            // Refresh list
            if (selectedPrefeitura) {
              const depts = await getDepartmentsByPrefeitura(selectedPrefeitura);
              setDepartments(depts);
            }
          }} 
          className="flex flex-col gap-4"
        >
          {isSystemAdmin ? (
            <div>
              <label className="block text-sm font-medium text-[#3f4948] mb-1">Selecione a Prefeitura</label>
              <select 
                name="prefeitura_id" 
                required 
                value={selectedPrefeitura}
                onChange={handlePrefeituraChange}
                className="w-full border border-[#e4e2e1] rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#006a69]"
              >
                <option value="">-- Selecione --</option>
                {initialPrefeituras.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          ) : (
            <input type="hidden" name="prefeitura_id" value={selectedPrefeitura} />
          )}
          <div>
            <label className="block text-sm font-medium text-[#3f4948] mb-1">Nome da Secretaria (Departamento)</label>
            <input type="text" name="name" required className="w-full border border-[#e4e2e1] rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#006a69]" />
          </div>
          <button type="submit" disabled={!selectedPrefeitura} className="mt-2 bg-[#006a69] text-white py-2 px-4 rounded-md font-semibold hover:bg-[#004d4c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            Salvar Secretaria
          </button>
        </form>

        {selectedPrefeitura && (
          <div className="mt-8">
            <h4 className="font-semibold text-[#1b1c1c] mb-2">Secretarias Vinculadas</h4>
            {loadingDepts ? (
              <p className="text-sm text-[#8e8b8a]">Carregando...</p>
            ) : (
              <ul className="space-y-2 max-h-48 overflow-y-auto">
                {departments.map(d => (
                  <li key={d.id} className="text-sm bg-[#f6f3f2] p-2 rounded-md">
                    {d.name}
                  </li>
                ))}
                {departments.length === 0 && <p className="text-sm text-[#8e8b8a]">Nenhuma secretaria vinculada.</p>}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
