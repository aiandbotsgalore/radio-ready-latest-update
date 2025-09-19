import React, { useState } from 'react';
import { LiveAPIProvider } from './context/LiveAPIProvider';
import { useProject } from './hooks/useProject';

import { Loader } from './components/Loader';
import { ScoreMeter } from './components/ScoreMeter';
import { AnalysisReportCard } from './components/AnalysisReportCard';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { ChatInterface } from './components/ChatInterface';
import { FrequencyVisualizer } from './components/FrequencyVisualizer';
import { AudioPlayer } from './components/AudioPlayer';
import { PluginManager } from './components/PluginManager';
import { Header } from './components/Header';
import { BookOpenIcon } from './components/icons/BookOpenIcon';
import { ChatBubbleLeftRightIcon } from './components/icons/ChatBubbleLeftRightIcon';
import { MasteringChainDisplay } from './components/MasteringChainDisplay';
import { ErrorScreen } from './components/ErrorScreen';
import { AnalysisQueue } from './components/AnalysisQueue';
import { MasteringChainGenerator } from './components/MasteringChainGenerator';
import { MagicWandIcon } from './components/icons/MagicWandIcon';
import { ProjectsModal } from './components/ProjectsModal';


const AppContent: React.FC = () => {
  const project = useProject();
  const {
      analyses,
      currentAnalysis,
      isProcessingQueue,
      error,
      userPlugins,
      setUserPlugins,
      activeTab,
      setActiveTab,
      audioProcessor,
      knowledgeBaseText,
      isRestoring,
      handleFilesSelected,
      handleGenerateArt,
      handleGenerateChain,
      handleNewProject,
      loadKnowledgeBase,
      setHoveredMetricKey,
      setCurrentAnalysisId,
      updateAnalysis,
      appState,
      currentProjectName,
  } = project;

  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);


  if (isRestoring) {
    return (
        <div className="flex h-screen items-center justify-center">
            <Loader />
        </div>
    );
  }

  const renderDashboard = () => {
    const report = currentAnalysis?.report;
    const isGeneratingArt = currentAnalysis?.isGeneratingArt ?? false;
    const isGeneratingChain = currentAnalysis?.isGeneratingChain ?? false;

    return (
        <div className="w-full max-w-screen-2xl mx-auto animate-fade-in p-4 sm:p-6 lg:p-8">
            <Header 
                analyses={analyses} 
                isProcessingQueue={isProcessingQueue}
                projectName={currentProjectName}
                onOpenProjects={() => setIsProjectsModalOpen(true)}
            />
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                {/* Left Column */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <AnalysisQueue
                        analyses={analyses}
                        currentAnalysisId={currentAnalysis?.id || null}
                        onSelect={setCurrentAnalysisId}
                        onAddFiles={handleFilesSelected}
                        onNewProject={handleNewProject}
                    />
                    {currentAnalysis && (
                         <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 backdrop-blur-sm relative">
                            <AudioPlayer audioProcessor={audioProcessor} />
                        </div>
                    )}
                    <div className="h-64 bg-gray-800/50 rounded-lg border border-gray-700/50 backdrop-blur-sm">
                        <FrequencyVisualizer analyserNode={audioProcessor.analyserNode} feedbackOverlay={null} />
                    </div>
                    <PluginManager plugins={userPlugins} setPlugins={setUserPlugins} onKnowledgeBaseUpdate={loadKnowledgeBase} />
                </div>

                {/* Right Column */}
                <div className="lg:col-span-3 bg-gray-800/50 border border-gray-700/50 rounded-lg backdrop-blur-sm min-h-[500px]">
                     {currentAnalysis ? (
                         <>
                            <div className="border-b border-gray-700/50">
                                <nav className="-mb-px flex gap-x-6 px-6" aria-label="Tabs">
                                    <button onClick={() => setActiveTab('analysis')} className={`inline-flex items-center gap-x-2 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors ${activeTab === 'analysis' ? 'border-indigo-400 text-indigo-300' : 'border-transparent text-gray-400 hover:border-gray-500 hover:text-gray-300'}`}>
                                    <BookOpenIcon className="w-5 h-5" /> Analysis
                                    </button>
                                    <button onClick={() => setActiveTab('chat')} className={`inline-flex items-center gap-x-2 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors ${activeTab === 'chat' ? 'border-indigo-400 text-indigo-300' : 'border-transparent text-gray-400 hover:border-gray-500 hover:text-gray-300'}`} disabled={!report}>
                                    <ChatBubbleLeftRightIcon className="w-5 h-5" /> AI Chat
                                    </button>
                                </nav>
                            </div>
                            <div className="p-6 relative">
                                {/* Analysis Tab */}
                                <div className={`transition-all duration-300 ease-in-out ${activeTab === 'analysis' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5 absolute invisible'}`}>
                                    {currentAnalysis.status === 'analyzing' && (
                                        <div className="flex h-96 items-center justify-center"><Loader /></div>
                                    )}
                                    {currentAnalysis.status === 'error' && currentAnalysis.error && (
                                        <ErrorScreen error={currentAnalysis.error} onReset={handleNewProject} />
                                    )}
                                    {currentAnalysis.status === 'success' && report && (
                                        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                                            <div className="md:col-span-2 flex flex-col gap-6">
                                                <div className="p-6 bg-gray-900/50 border border-gray-700/50 rounded-lg flex flex-col items-center text-center">
                                                    <h3 className="text-xl font-semibold mb-4 text-white">Overall Score</h3>
                                                    <ScoreMeter score={report.overallScore} size={150} strokeWidth={12} />
                                                    <p className="mt-4 text-center text-gray-300 text-sm leading-relaxed">{report.overallFeedback}</p>
                                                </div>
                                                <div className="p-6 bg-gray-900/50 border border-gray-700/50 rounded-lg flex flex-col items-center text-center">
                                                    <h3 className="text-xl font-semibold mb-2 text-white">Album Art</h3>
                                                    <p className="text-xs text-gray-400 mb-4">AI-generated from analysis</p>
                                                    {currentAnalysis.albumArt ? <img src={currentAnalysis.albumArt} alt="Generated album art" className="w-full aspect-square rounded-md object-cover shadow-lg" /> : (
                                                        <div className="w-full aspect-square bg-gray-700/50 rounded-md flex flex-col items-center justify-center p-4">
                                                            {isGeneratingArt ? <Loader /> : (
                                                                <button onClick={() => handleGenerateArt(currentAnalysis.id)} className="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors">
                                                                    <SparklesIcon className="w-5 h-5" /> Generate
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="md:col-span-3 grid grid-cols-1 gap-6 content-start">
                                                <AnalysisReportCard title="Dynamic Range" metric={report.dynamicRange} pluginList={userPlugins} knowledgeBaseText={knowledgeBaseText} />
                                                <AnalysisReportCard 
                                                title="Frequency Balance" 
                                                metric={report.frequencyBalance} 
                                                pluginList={userPlugins} 
                                                knowledgeBaseText={knowledgeBaseText}
                                                onMouseEnter={() => setHoveredMetricKey('frequencyBalance')}
                                                onMouseLeave={() => setHoveredMetricKey(null)}
                                                />
                                                <AnalysisReportCard title="Stereo Image" metric={report.stereoImage} pluginList={userPlugins} knowledgeBaseText={knowledgeBaseText} />
                                                <AnalysisReportCard title="Clarity & Definition" metric={report.clarityAndDefinition} pluginList={userPlugins} knowledgeBaseText={knowledgeBaseText} />
                                                <AnalysisReportCard title="Genre Fitness" metric={report.genreFitness} pluginList={userPlugins} knowledgeBaseText={knowledgeBaseText} />
                                                <AnalysisReportCard title="Mood Congruence" metric={report.moodCongruence} pluginList={userPlugins} knowledgeBaseText={knowledgeBaseText} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {/* Chat Tab */}
                                <div className={`transition-all duration-300 ease-in-out ${activeTab === 'chat' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-5 absolute invisible'}`}>
                                    <ChatInterface suggestedQuestions={currentAnalysis.chatSuggestions} />
                                </div>
                            </div>
                        </>
                     ) : (
                         <div className="flex flex-col items-center justify-center h-full text-center p-8">
                            <BookOpenIcon className="w-16 h-16 text-gray-600"/>
                            <h2 className="mt-4 text-xl font-semibold text-white">No Analysis Selected</h2>
                            <p className="mt-1 text-gray-400">Select a completed analysis from the queue to view its details.</p>
                         </div>
                     )
                    }
                </div>
            </div>
            
            {/* Mastering Chain Section */}
            {currentAnalysis && currentAnalysis.status === 'success' && report && (
                <div className="mt-8 bg-gray-800/50 border border-gray-700/50 rounded-lg backdrop-blur-sm p-6 lg:p-8 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                        <div className="md:col-span-1">
                            <MasteringChainGenerator
                                analysis={currentAnalysis}
                                isGenerating={isGeneratingChain || false}
                                onGenerate={() => handleGenerateChain(currentAnalysis.id)}
                                onUpdate={(updates) => updateAnalysis(currentAnalysis.id, updates)}
                            />
                        </div>
                        <div className="md:col-span-2">
                            {currentAnalysis.masteringChain ? (
                                <MasteringChainDisplay chain={currentAnalysis.masteringChain} />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full rounded-lg bg-gray-900/30 border border-gray-700/50 p-8 min-h-[200px] text-center">
                                    <MagicWandIcon className="w-12 h-12 text-gray-600 mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-200">Your AI Mastering Chain Awaits</h3>
                                    <p className="mt-1 text-sm text-gray-400">
                                        Fill out the brief on the left and click "Generate" to see the AI's recommendations.
                                    </p>
                                </div>
                            )}
                            {currentAnalysis.chainError && (
                                <div className="mt-4 p-4 bg-red-900/30 border border-red-500/50 rounded-md text-center">
                                    <p className="text-sm text-red-300">{currentAnalysis.chainError}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
  }
  
  const renderIdleState = () => (
     <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center p-8">
        <Header 
            projectName={currentProjectName}
            onOpenProjects={() => setIsProjectsModalOpen(true)}
        />
        <p className="mt-4 text-lg text-gray-300">Let our AI mastering engineer give your track a professional analysis.</p>
        <div className="mt-10 w-full">
            <AudioPlayer onFilesSelect={handleFilesSelected} audioProcessor={audioProcessor} />
        </div>
    </div>
  )

  const renderContent = () => {
    // Show dashboard as soon as there are files in the queue
    if (analyses.length > 0) {
      return renderDashboard();
    }
    
    // Fallback to error or idle
    switch (appState) {
      case 'error':
        return <ErrorScreen error={error} onReset={handleNewProject} />;
      case 'idle':
      default:
        return renderIdleState();
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 font-sans animated-bg">
       <div className="absolute inset-0 -z-10 h-full w-full bg-gray-900 bg-[radial-gradient(#2d3748_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
       {renderContent()}
       <ProjectsModal
            isOpen={isProjectsModalOpen}
            onClose={() => setIsProjectsModalOpen(false)}
            projectHook={project}
       />
    </main>
  );
};

const App: React.FC = () => (
  <LiveAPIProvider>
    <AppContent />
  </LiveAPIProvider>
);

export default App;
