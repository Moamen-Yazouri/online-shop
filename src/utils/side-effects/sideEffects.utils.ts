import { ISideEffect } from "./sideEffects.types";

export class SideEffectsQueue {
    private effects: ISideEffect[] = [];

    insertOne(sideEffect: ISideEffect) {
        this.effects.push(sideEffect);
    }



  async runAll() {
    if (!this.effects.length) return;
    const results = await Promise.allSettled(this.effects.map((e) => Promise.resolve(e.effect())));

        results.forEach((r, i) => {
        const { label } = this.effects[i];
        if (r.status === 'rejected') {
            console.error(`[SideEffect FAIL] ${label}:`, r.reason);
            // you can store error in db
        } else {
            console.log(`[SideEffect OK] ${label}`);
        }
        });
        this.effects = []
    }

    
}