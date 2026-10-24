try:
    from pipeline.orchestrator import *
    from pipeline.orchestrator import Orchestrator, MANIFEST_PATH, main
except ModuleNotFoundError:
    from tools.pipeline.orchestrator import *
    from tools.pipeline.orchestrator import Orchestrator, MANIFEST_PATH, main
