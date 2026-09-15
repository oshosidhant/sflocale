import Image from "next/image";
import ScrollProgress from "@/components/ScrollProgress";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <header><div className="column header-inner"><a className="wordmark" href="#top">SF Locale</a></div></header>
      <div className="hero" id="top"><div className="column hero-grid"><div><h1>Filmmaking is a sequence of judgments.</h1><p className="summary">SF Locale studies how human decisions can guide video systems across shots, scenes and complete films.</p><a className="trajectory-button" href="/trajectory">Trajectory <span aria-hidden="true">→</span></a></div><dl className="hero-stats" aria-label="SF Locale production archive"><div><dt>5</dt><dd>feature (70+ min) films completed</dd></div><div><dt>1M+</dt><dd>generations recorded</dd></div><div><dt>4K</dt><dd>director annotation hours</dd></div></dl></div></div>
      <main className="column">
        <p className="lead">The production process creates a dataset of intent, alternatives, choices, revisions and consequences.</p>
        <figure className="walkthrough-figure"><Image className="evidence-image" src="/research/trajectory-walkthrough.gif" alt="Scene 4 production map transitions to a complete keyframe trajectory and then to a candidate reward and prompt inspector." width={900} height={548} sizes="(max-width: 756px) calc(100vw - 56px), 700px" unoptimized /><figcaption><span className="caption-label">Trajectory walkthrough.</span> A scene map opens into a single keyframe route, then reveals the prompt and multi-head audit for one candidate.</figcaption></figure>
        <section id="production-data">
          <p className="section-label">Production archive</p><h2>The research begins inside production.</h2>
          <p>SF Locale began using generative models in January 2026. The studio has completed five feature-length films since then.</p>
          <div className="data-list" aria-label="Production archive summary">
            <div className="data-line"><strong>5</strong><span>feature-length films have been completed.</span></div>
            <div className="data-line"><strong>1M+</strong><span>image and video generations have been recorded.</span></div>
            <div className="data-line"><strong>50K+</strong><span>revision chains have been preserved.</span></div>
            <div className="data-line"><strong>4,000</strong><span>hours of director annotation have been collected.</span></div>
            <div className="data-line"><strong>100K</strong><span>shots are represented in the archive.</span></div>
          </div>
          <p>Each record can connect a shot&apos;s intent, prompt, references, candidate family, director choice, revision reason and final position in sequence.</p>
          <figure className="evidence-figure"><Image className="evidence-image" src="/research/trajectory-scene-map.png" alt="Scene 4 production map with 35 keyframes, candidate counts and generated-reference lineage." width={1500} height={913} sizes="(max-width: 756px) calc(100vw - 56px), 700px" /><figcaption><span className="caption-label">Production map.</span> The Scene 4 archive exposes 35 keyframe families, their candidate counts and cross-keyframe reference reuse.</figcaption></figure>
        </section>
        <section id="trajectory">
          <p className="section-label">Research object</p><h2>The trajectory is the learning object.</h2>
          <p>A finished shot contains only the result. The production trajectory preserves the alternatives that were considered, the actions that produced them and the judgment that moved the film forward.</p>
          <p>The archive is being reconstructed as a branching decision graph. A route can be locked, revised, retained for later use or terminated. A selected image can also become a reference for a later shot.</p>
          <figure aria-labelledby="trajectory-caption"><div className="trajectory" role="img" aria-label="A production state leads to a generation action, a candidate family, a human decision and the next production state. Human decisions can lock, revise or terminate a route.">
            <div className="process-step"><strong>Production state</strong><div className="process-copy">Canon, lineage, prior decisions and the current shot objective.</div></div>
            <div className="process-step"><strong>Generation action</strong><div className="process-copy">Prompt, ordered references, model version, settings and workflow operation.</div></div>
            <div className="process-step"><strong>Candidate family</strong><div className="process-copy">The alternatives that were available to the filmmaker at this point.</div></div>
            <div className="process-step judgment"><strong>Human decision</strong><div className="process-copy">The choice, feedback and reason recorded in the production context.<div className="decision-options"><div><strong>Lock</strong><span>Commit the shot.</span></div><div><strong>Revise</strong><span>Continue the route.</span></div><div><strong>Terminate</strong><span>Close the route.</span></div></div></div></div>
            <div className="process-step"><strong>Next state</strong><div className="process-copy">The decision updates the branch, canon and context available to later shots.</div></div>
          </div><figcaption id="trajectory-caption"><span className="caption-label">Figure 1.</span> The graph is event-sourced. New decisions extend the record without erasing earlier states.</figcaption></figure>
          <figure className="formula-figure" aria-labelledby="trajectory-formula-caption"><pre className="formula"><code>τₜ = (Xₜ, Aₜ, Oₜ, Hₜ, Fₜ, Xₜ₊₁, Gₜ, Cₜ, Yₜ)</code></pre><figcaption id="trajectory-formula-caption"><span className="caption-label">Trajectory record.</span> X is the production state, A the generation action, O the candidate family, H the human decision, F the feedback, G the lineage, C the active canon and Y the later outcome.</figcaption></figure>
          <figure className="evidence-figure"><Image className="evidence-image" src="/research/trajectory-keyframe-route.png" alt="A complete keyframe trajectory with three action families and fifteen candidate images." width={1500} height={913} sizes="(max-width: 756px) calc(100vw - 56px), 700px" /><figcaption><span className="caption-label">One route in full.</span> Each action preserves its references, candidate family and the decision state it left unresolved.</figcaption></figure>
        </section>
        <section id="representation">
          <p className="section-label">State representation</p><h2>The model needs the state of the film.</h2>
          <p>A prompt does not describe everything that makes a candidate useful. The same image can be correct in one sequence and unusable in another. A useful representation needs the context that shaped the decision.</p>
          <dl className="field-list">
            <div className="field-row"><dt>Active canon</dt><dd>The committed facts of the film, including character identity, location, wardrobe, props, time and visual rules.</dd></div>
            <div className="field-row"><dt>Lineage</dt><dd>The parent candidates, references, branches and workflow operations that produced the current state.</dd></div>
            <div className="field-row"><dt>Human history</dt><dd>The locks, shortlists, rejections, revisions, retained branches and prior reasons around the shot.</dd></div>
            <div className="field-row"><dt>Shot objective</dt><dd>The narrative purpose, desired performance, framing, movement and relation to surrounding shots.</dd></div>
            <div className="field-row"><dt>Production pressure</dt><dd>The time, compute, budget and delivery constraints active when the decision was made.</dd></div>
          </dl>
        </section>
        <section id="first-experiment">
          <p className="section-label">First benchmark</p><h2>The first experiment tests whether context improves prediction.</h2>
          <p>The first benchmark can compare a simple critic that sees a candidate and prompt with a contextual critic that also sees canon, references, lineage and earlier decisions. Both models predict the filmmaker&apos;s recorded choice.</p>
          <figure aria-labelledby="experiment-caption"><div className="experiment" role="img" aria-label="A baseline model uses a candidate and prompt. A contextual model also uses canon, references, lineage and earlier decisions. Both predict the filmmaker's choice and are compared on future production data.">
            <div className="experiment-row"><strong>Baseline</strong><div className="experiment-input">Candidate image and prompt</div><div className="arrow" aria-hidden="true">→</div><div className="experiment-output">Predicted filmmaker choice</div></div>
            <div className="experiment-row"><strong>Contextual</strong><div className="experiment-input">Candidate, prompt, canon, references, lineage and prior decisions</div><div className="arrow" aria-hidden="true">→</div><div className="experiment-output">Predicted filmmaker choice</div></div>
            <div className="experiment-row evaluation-row"><strong>Evaluation</strong><div className="experiment-input">Compare both predictions with recorded choices from later production states and held-out films.</div></div>
          </div><figcaption id="experiment-caption"><span className="caption-label">Figure 2.</span> Chronological and cross-film splits reduce leakage from sibling candidates, repeated assets and future decisions.</figcaption></figure>
          <p className="hypothesis">Production context and trajectory history should improve the prediction of filmmaker choices, repairs and stopping decisions.</p><p>The evaluation can measure pairwise accuracy, top-k lock recall, ranking quality, calibration, abstention, next-action accuracy and repair-cost prediction. Performance should be reported over time and across held-out films.</p>
        </section>
        <section id="reward">
          <p className="section-label">Reward model</p><h2>Human judgment has several dimensions.</h2>
          <p>A lock means that a candidate was selected for a specific role in a specific production state. It does not mean that the candidate is universally good. An unselected candidate may become useful later, and an unseen candidate provides no preference evidence.</p><p>A critic can keep separate estimates for intent, reference fidelity, canon consistency, performance, cinematography, technical quality, narrative function and production utility. The weight of each estimate can change with the production state.</p>
          <figure className="formula-figure" aria-labelledby="value-formula-caption"><pre className="formula"><code>Q(Sₜ, s) = immediate fit + future utility − expected repair cost</code></pre><figcaption id="value-formula-caption"><span className="caption-label">Value hypothesis.</span> The value of a candidate depends on its immediate role, its later usefulness and the repairs it may create.</figcaption></figure><p className="footnote"><strong>Research note.</strong> The archive does not yet establish a calibrated value function or a causal measure of future repair cost.</p>
          <figure className="evidence-figure"><Image className="evidence-image" src="/research/trajectory-reward-inspector.png" alt="A selected counterfactual candidate alongside its reward vector, prompt and action references." width={1500} height={913} sizes="(max-width: 756px) calc(100vw - 56px), 700px" /><figcaption><span className="caption-label">Candidate audit.</span> The inspector makes the current heuristic transparent: its prompt, references, individual reward heads and evidence limitations remain visible.</figcaption></figure>
        </section>
        <section id="research-targets">
          <p className="section-label">Learning problems</p><h2>The archive supports several learning problems.</h2>
          <div className="research-list">
            <div className="research-item"><h3>Selection</h3><p>Rank candidates for the current shot and explain which constraints drive the ranking.</p></div>
            <div className="research-item"><h3>Orchestration</h3><p>Predict the next production action, including revision, model choice, workflow operation and branch change.</p></div>
            <div className="research-item"><h3>Reference policy</h3><p>Choose which prior images, characters, locations and style references should condition the next action.</p></div>
            <div className="research-item"><h3>Stopping</h3><p>Estimate when a route is ready to lock and when further generation has low expected value.</p></div>
            <div className="research-item"><h3>Continuity</h3><p>Predict when a local choice will create later repairs or reduce creative options elsewhere in the film.</p></div>
            <div className="research-item"><h3>Scene policy</h3><p>Coordinate shot scale, composition, movement, duration and order across a complete scene.</p></div>
          </div>
        </section>
        <section id="program">
          <p className="section-label">Research program</p><h2>The research proceeds from measurement to assistance.</h2><p>The current program treats existing generators as components of the production environment. The immediate work is to make the trajectory auditable and establish reliable baselines.</p>
          <div className="sequence">
            <div className="sequence-step"><strong>Reconstruct</strong><span>Recover candidate sets, lineage, exposure, choices, feedback and delayed outcomes.</span></div><div className="sequence-step"><strong>Measure</strong><span>Audit missingness, censoring, branch termination, reference reuse and disagreement.</span></div><div className="sequence-step"><strong>Learn</strong><span>Train state-conditioned preference models on chronological held-out data.</span></div><div className="sequence-step"><strong>Predict</strong><span>Test next actions, stopping decisions, likely failures and future repairs.</span></div><div className="sequence-step"><strong>Assist</strong><span>Evaluate decision support with visible uncertainty and human override.</span></div><div className="sequence-step"><strong>Pilot</strong><span>Run a limited human-supervised production study after offline evaluation.</span></div>
          </div>
          <p className="footnote"><strong>Current status.</strong> The archive and system definitions exist. Model training and validation remain open research work. The page makes no claim that a production reward model, orchestration policy or debt model has been trained.</p>
        </section>
        <section id="studio"><p className="section-label">Research practice</p><h2>The studio funds research through film production.</h2><p>SF Locale is a studio of filmmakers and engineers from IIT Bombay and IIT BHU. The studio makes films for clients and for its own projects. Production funds the research and continues to grow the trajectory archive.</p></section>
      </main>
      <footer className="site-footer" id="contact"><div className="column"><p className="footer-label">Collaboration</p><h2>We want researchers who can make these questions measurable.</h2><p>We are interested in collaborations in video generation, preference learning, computational cinematography, multimodal evaluation and long-form consistency.</p><p>Useful work includes building leakage-resistant benchmarks, learning from partial preferences, representing active canon, modeling delayed repair and evaluating human decision support in production.</p><p>Tell us which question you would test and what evidence you would need from the archive.</p><a className="contact-link" href="mailto:research@sflocale.com">research@sflocale.com</a></div></footer>
    </>
  );
}
