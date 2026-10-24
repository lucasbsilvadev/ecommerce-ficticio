try:
    from pipeline.segmentation import *
    from pipeline.segmentation import (
        get_session, apply_crop_hint, bypass_ai_mask, segment_ai, clean_mask, get_object_bbox,
    )
except ModuleNotFoundError:
    from tools.pipeline.segmentation import *
    from tools.pipeline.segmentation import (
        get_session, apply_crop_hint, bypass_ai_mask, segment_ai, clean_mask, get_object_bbox,
    )
