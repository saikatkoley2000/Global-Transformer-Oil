import React, { useState, useMemo } from 'react';
import { Filter, Search, FileText, X, Activity, Globe, Factory, Database } from 'lucide-react';
import rawData from './data.json';

const App = () => {
  const [data] = useState(rawData);
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'country', 'manufacturer'
  
  // Data for Products Tab
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    primaryStandard: '',
    grade: '',
    secondarySpecs: '',
    category: '',
    inhibition: ''
  });
  const [selectedProduct, setSelectedProduct] = useState(null);

  // For expanded manufacturers
  const [expandedMfrs, setExpandedMfrs] = useState(new Set());
  const toggleMfr = (name) => {
    setExpandedMfrs(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const keyMapping = {
    primaryStandard: 'Primary Standard Family',
    grade: 'Standard Class/Grade (normalized)',
    secondarySpecs: 'Secondary Specs',
    category: 'Oil Category',
    inhibition: 'Inhibition Type'
  };

  const dynamicOptions = useMemo(() => {
    const getOptions = (filterKey) => {
      const subset = data.filter(item => {
        const matchSearch = item['Product Name/Code']?.toLowerCase().includes(search.toLowerCase()) || 
                            item['Manufacturer']?.toLowerCase().includes(search.toLowerCase());
        
        const matchPrimary = (filterKey === 'primaryStandard' || !filters.primaryStandard) ? true : item['Primary Standard Family'] === filters.primaryStandard;
        const matchGrade = (filterKey === 'grade' || !filters.grade) ? true : item['Standard Class/Grade (normalized)'] === filters.grade;
        const matchSecondary = (filterKey === 'secondarySpecs' || !filters.secondarySpecs) ? true : item['Secondary Specs'] === filters.secondarySpecs;
        const matchCategory = (filterKey === 'category' || !filters.category) ? true : item['Oil Category'] === filters.category;
        const matchInhibition = (filterKey === 'inhibition' || !filters.inhibition) ? true : item['Inhibition Type'] === filters.inhibition;

        return matchSearch && matchPrimary && matchGrade && matchSecondary && matchCategory && matchInhibition;
      });
      return [...new Set(subset.map(item => item[keyMapping[filterKey]]).filter(Boolean))].sort();
    };

    return {
      primaryStandard: getOptions('primaryStandard'),
      grade: getOptions('grade'),
      secondarySpecs: getOptions('secondarySpecs'),
      category: getOptions('category'),
      inhibition: getOptions('inhibition')
    };
  }, [data, search, filters]);
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchSearch = item['Product Name/Code']?.toLowerCase().includes(search.toLowerCase()) || 
                          item['Manufacturer']?.toLowerCase().includes(search.toLowerCase());
      
      const matchPrimary = filters.primaryStandard ? item['Primary Standard Family'] === filters.primaryStandard : true;
      const matchGrade = filters.grade ? item['Standard Class/Grade (normalized)'] === filters.grade : true;
      const matchSecondary = filters.secondarySpecs ? item['Secondary Specs'] === filters.secondarySpecs : true;
      const matchCategory = filters.category ? item['Oil Category'] === filters.category : true;
      const matchInhibition = filters.inhibition ? item['Inhibition Type'] === filters.inhibition : true;

      return matchSearch && matchPrimary && matchGrade && matchSecondary && matchCategory && matchInhibition;
    });
  }, [data, search, filters]);

  // Data for Country Tab
  const countries = useMemo(() => {
    const grouped = {};
    data.forEach(item => {
      const country = item['Region/Country'] || 'Unknown';
      if (!grouped[country]) grouped[country] = new Set();
      grouped[country].add(item['Manufacturer']);
    });
    return Object.keys(grouped).sort().map(c => ({
      name: c,
      manufacturers: Array.from(grouped[c]).sort()
    }));
  }, [data]);

  // Data for Manufacturer Tab
  const manufacturers = useMemo(() => {
    const grouped = {};
    data.forEach(item => {
      const mfr = item['Manufacturer'] || 'Unknown';
      if (!grouped[mfr]) {
        grouped[mfr] = {
          country: item['Region/Country'],
          brands: new Set(),
          products: []
        };
      }
      if (item['Brand/Family']) grouped[mfr].brands.add(item['Brand/Family']);
      grouped[mfr].products.push(item);
    });
    return Object.keys(grouped).sort().map(m => ({
      name: m,
      country: grouped[m].country,
      brands: Array.from(grouped[m].brands),
      products: grouped[m].products
    }));
  }, [data]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-6 selection:bg-blue-200">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-xl border border-blue-200 shadow-sm">
              <Activity className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Transformer Oils Dashboard
              </h1>
              <p className="text-slate-500 font-medium text-sm mt-1">Technical Data Sheet Explorer</p>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
            <button 
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'products' ? 'bg-white text-blue-700 shadow-sm border border-slate-200/60' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Database className="w-4 h-4" /> Products
            </button>
            <button 
              onClick={() => setActiveTab('country')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'country' ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/60' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Globe className="w-4 h-4" /> By Country
            </button>
            <button 
              onClick={() => setActiveTab('manufacturer')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'manufacturer' ? 'bg-white text-purple-700 shadow-sm border border-slate-200/60' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Factory className="w-4 h-4" /> TO Manufacturers
            </button>
          </div>
        </header>

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div className="flex flex-col md:flex-row gap-6 items-stretch animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Sidebar Filters */}
            <aside className="w-full md:w-72 shrink-0 space-y-6">
              <div className="glass-panel p-5 rounded-2xl">
                <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-3">
                  <Filter className="w-5 h-5 text-blue-600" />
                  <h2 className="font-bold text-slate-800">Advanced Filters</h2>
                </div>
                
                <div className="space-y-5">
                  <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search..." 
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-400 text-slate-800"
                    />
                  </div>
                  <FilterSelect 
                    label="Primary Standard" 
                    options={dynamicOptions.primaryStandard} 
                    value={filters.primaryStandard}
                    onChange={v => setFilters({...filters, primaryStandard: v})}
                    color="blue"
                  />
                  <FilterSelect 
                    label="Standard Class/Grade" 
                    options={dynamicOptions.grade} 
                    value={filters.grade}
                    onChange={v => setFilters({...filters, grade: v})}
                    color="indigo"
                  />
                  <FilterSelect 
                    label="Secondary Specs" 
                    options={dynamicOptions.secondarySpecs} 
                    value={filters.secondarySpecs}
                    onChange={v => setFilters({...filters, secondarySpecs: v})}
                    color="purple"
                  />
                  <FilterSelect 
                    label="Oil Category" 
                    options={dynamicOptions.category} 
                    value={filters.category}
                    onChange={v => setFilters({...filters, category: v})}
                    color="emerald"
                  />
                  <FilterSelect 
                    label="Inhibition Type" 
                    options={dynamicOptions.inhibition} 
                    value={filters.inhibition}
                    onChange={v => setFilters({...filters, inhibition: v})}
                    color="orange"
                  />
                  <button 
                    onClick={() => {
                      setSearch('');
                      setFilters({primaryStandard: '', grade: '', secondarySpecs: '', category: '', inhibition: ''});
                    }}
                    className="w-full mt-4 py-2 px-4 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-sm"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            </aside>

            {/* Main Grid */}
            <main className="flex-1 glass-panel rounded-2xl overflow-hidden h-[calc(100vh-160px)] shadow-sm relative">
              <div className="absolute inset-0 overflow-auto custom-scrollbar bg-white/50">
                <table className="w-full text-left text-sm whitespace-nowrap min-w-max">
                  <thead className="sticky top-0 z-10 bg-slate-100 backdrop-blur-md border-b border-slate-200 text-slate-700 shadow-sm">
                    <tr>
                      <th className="px-6 py-4 font-bold tracking-wide">Product Details</th>
                      <th className="px-6 py-4 font-bold tracking-wide">Standard & Grade</th>
                      <th className="px-6 py-4 font-bold tracking-wide">Category & Features</th>
                      <th className="px-6 py-4 font-bold tracking-wide text-center">Datasheet</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredData.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-16 text-center text-slate-500 font-medium">
                          No products found matching your criteria.
                        </td>
                      </tr>
                    ) : filteredData.map((item, idx) => (
                      <tr key={idx} className="hover:bg-blue-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-800 text-base">{item['Product Name/Code'] || 'N/A'}</div>
                          <div className="text-xs font-semibold text-blue-600 mt-1 bg-blue-100/50 inline-block px-2 py-0.5 rounded-full border border-blue-200/50">
                            {item['Manufacturer']} • {item['Region/Country']}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-indigo-700">{item['Primary Standard Family'] || '-'}</div>
                          <div className="text-xs text-slate-600 mt-1 truncate max-w-[250px] font-medium" title={item['Standard Class/Grade (normalized)']}>
                            {item['Standard Class/Grade (normalized)'] || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-emerald-700 bg-emerald-50 inline-block px-2 py-0.5 rounded border border-emerald-100">{item['Oil Category'] || '-'}</div>
                          <div className="text-xs font-medium text-orange-600 mt-1 ml-1">{item['Inhibition Type'] || '-'}</div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {item.localPath ? (
                            <button 
                              onClick={() => setSelectedProduct(item)}
                              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white text-blue-600 border border-blue-200 hover:bg-blue-600 hover:text-white hover:shadow-md transition-all font-semibold"
                            >
                              <FileText className="w-4 h-4" />
                              <span>View PDS</span>
                            </button>
                          ) : (
                            <span className="text-slate-400 font-medium text-xs px-3 py-2 bg-slate-100 rounded-lg inline-block border border-slate-200">Unavailable</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </main>
          </div>
        )}

        {/* COUNTRY TAB */}
        {activeTab === 'country' && (
          <div className="glass-panel p-8 rounded-2xl min-h-[calc(100vh-160px)] animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white">
            <h2 className="text-2xl font-bold text-emerald-700 mb-8 flex items-center gap-3 border-b border-slate-100 pb-4">
              <Globe className="w-7 h-7" /> Manufacturers by Country
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {countries.map((country, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xl border border-emerald-200">
                      {country.name.charAt(0)}
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">{country.name}</h3>
                  </div>
                  <ul className="space-y-3 pl-2">
                    {country.manufacturers.map((mfr, i) => (
                      <li key={i} className="flex items-center gap-2 text-slate-600 font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                        <span className="text-emerald-800">{mfr}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MANUFACTURER TAB */}
        {activeTab === 'manufacturer' && (
          <div className="glass-panel p-8 rounded-2xl min-h-[calc(100vh-160px)] animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white">
            <h2 className="text-2xl font-bold text-purple-700 mb-8 flex items-center gap-3 border-b border-slate-100 pb-4">
              <Factory className="w-7 h-7" /> Transformer Oil Manufacturers
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {manufacturers.map((mfr, idx) => {
                const isExpanded = expandedMfrs.has(mfr.name);
                const visibleProducts = isExpanded ? mfr.products : mfr.products.slice(0, 5);
                const hasMore = mfr.products.length > 5;

                return (
                  <div key={idx} className="bg-white border border-purple-100 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all hover:border-purple-300">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-extrabold text-slate-800 mb-1">{mfr.name}</h3>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
                          <Globe className="w-3.5 h-3.5" /> {mfr.country}
                        </div>
                      </div>
                      <div className="text-center bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
                        <div className="text-2xl font-black text-blue-600 leading-none">{mfr.products.length}</div>
                        <div className="text-[10px] uppercase font-bold text-slate-500 mt-1">Products</div>
                      </div>
                    </div>
                    
                    {mfr.brands.length > 0 && (
                      <div className="mb-4">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Brands: </span>
                        <span className="text-sm font-semibold text-slate-700">{mfr.brands.filter(b => b && b !== 'N/A').join(', ')}</span>
                      </div>
                    )}

                    <div className="mt-5 pt-4 border-t border-slate-100">
                      <h4 className="text-sm font-bold text-slate-800 mb-3">Key Products:</h4>
                      <div className="flex flex-wrap gap-2">
                        {visibleProducts.map((p, i) => (
                          <button 
                            key={i} 
                            onClick={() => p.localPath && setSelectedProduct(p)}
                            className={`text-xs font-medium px-2.5 py-1 rounded-md border text-left flex items-center gap-1.5 transition-all ${
                              p.localPath 
                                ? 'bg-white hover:bg-blue-50 text-blue-700 border-blue-200 hover:border-blue-300 cursor-pointer shadow-sm hover:shadow' 
                                : 'bg-slate-50 text-slate-500 border-slate-200 cursor-default opacity-80'
                            }`}
                            title={p.localPath ? "Click to view PDS" : "PDS Unavailable"}
                          >
                            {p.localPath && <FileText className="w-3 h-3 text-blue-500" />}
                            {p['Product Name/Code']}
                          </button>
                        ))}
                        
                        {!isExpanded && hasMore && (
                          <button 
                            onClick={() => toggleMfr(mfr.name)}
                            className="text-xs font-bold px-2.5 py-1 bg-purple-100 text-purple-700 rounded-md border border-purple-200 hover:bg-purple-200 transition-colors shadow-sm"
                          >
                            +{mfr.products.length - 5} more
                          </button>
                        )}
                        {isExpanded && hasMore && (
                          <button 
                            onClick={() => toggleMfr(mfr.name)}
                            className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md border border-slate-200 hover:bg-slate-200 transition-colors shadow-sm"
                          >
                            Show less
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Datasheet Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-6xl h-[90vh] rounded-2xl flex flex-col overflow-hidden border border-slate-200 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div>
                <h3 className="text-xl font-bold text-slate-800">{selectedProduct['Product Name/Code']}</h3>
                <p className="text-sm font-semibold text-blue-600 mt-0.5">{selectedProduct['Manufacturer']}</p>
              </div>
              <div className="flex items-center gap-4">
                <a 
                  href={selectedProduct.localPath} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 transition-colors"
                >
                  Open in New Tab
                </a>
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="p-2 rounded-lg bg-slate-200 hover:bg-red-100 text-slate-600 hover:text-red-600 transition-colors border border-transparent hover:border-red-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-slate-200">
              <iframe 
                src={selectedProduct.localPath} 
                className="w-full h-full border-none"
                title="Datasheet"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FilterSelect = ({ label, options, value, onChange, color = 'blue' }) => {
  const colorMap = {
    blue: 'text-blue-700 focus:ring-blue-500',
    indigo: 'text-indigo-700 focus:ring-indigo-500',
    purple: 'text-purple-700 focus:ring-purple-500',
    emerald: 'text-emerald-700 focus:ring-emerald-500',
    orange: 'text-orange-700 focus:ring-orange-500',
  };

  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{label}</label>
      <div className="relative">
        <select 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full bg-white border border-slate-300 rounded-lg pl-3 pr-10 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm appearance-none cursor-pointer ${colorMap[color]}`}
        >
          <option value="">All</option>
          {options.map((opt, i) => (
            <option key={i} value={opt}>{opt}</option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </div>
    </div>
  );
};

export default App;
