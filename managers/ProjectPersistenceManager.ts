import type { ProjectData } from '../types';
import { clearCurrentSession, loadCurrentSession, saveCurrentSession, saveNamedProject, loadNamedProject } from '../lib/db';

interface ProjectPersistenceDeps {
    onApply: (data: ProjectData, name?: string, id?: string) => void;
}

/**
 * Handles project persistence concerns (session restore, save/load, import/export).
 */
export class ProjectPersistenceManager {
    constructor(private readonly deps: ProjectPersistenceDeps) {}

    public async restoreLastSession() {
        const savedState = await loadCurrentSession();
        if (savedState) {
            this.deps.onApply(savedState);
        }
    }

    public async persistSession(state: Omit<ProjectData, 'id'>) {
        await saveCurrentSession(state);
    }

    public async saveNamedProject(name: string, state: ProjectData, existingId?: string) {
        const saved = await saveNamedProject(name, state, existingId);
        this.deps.onApply(state, saved.name, saved.id);
        return saved.id;
    }

    public async loadNamedProject(id: string) {
        const project = await loadNamedProject(id);
        if (!project) {
            throw new Error('Project not found.');
        }
        this.deps.onApply(project, project.name, project.id);
    }

    public exportProject(state: ProjectData, filename: string) {
        const jsonString = JSON.stringify(state, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = filename;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
    }

    public async importProject(file: File) {
        const text = await file.text();
        const projectData = JSON.parse(text) as ProjectData;
        if (!Array.isArray(projectData.analyses) || typeof projectData.userPlugins !== 'string') {
            throw new Error('Invalid project file format.');
        }
        this.deps.onApply(projectData, `${file.name.replace('.json', '')} (imported)`);
    }

    public clearSessionState() {
        clearCurrentSession();
    }
}
