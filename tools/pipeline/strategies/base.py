"""Base strategy for image processing."""
from abc import ABC, abstractmethod
from PIL import Image


class BaseStrategy(ABC):
    """Abstract base strategy. Subclasses implement process(image, context)."""

    @abstractmethod
    def process(self, image, context) -> Image.Image:
        """Process an image according to the strategy and return the final image."""
        raise NotImplementedError
