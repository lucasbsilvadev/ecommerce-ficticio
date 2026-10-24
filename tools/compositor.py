try:
    from pipeline.compositor import *
    from pipeline.compositor import add_contact_shadow, fit_to_canvas, standardize
except ModuleNotFoundError:
    from tools.pipeline.compositor import *
    from tools.pipeline.compositor import add_contact_shadow, fit_to_canvas, standardize
