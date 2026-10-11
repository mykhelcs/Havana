<?php

namespace App\Domain\Property;

use App\Enums\PropertyStatus;

class PropertyService
{
    public function __construct(private PropertyRepository $propertyRepository) {}

    public function createProperty(CreatePropertyCommand $cmd): PropertyData
    {
        return $this->propertyRepository->createProperty($cmd);
    }

    public function updateProperty(string $id, UpdatePropertyCommand $cmd): ?PropertyData
    {
        $existing = $this->propertyRepository->findById($id);
        if (!$existing) {
            return null;
        }

        return $this->propertyRepository->updateProperty($id, $cmd);
    }

    public function updateStatus(string $id, PropertyStatus $status): ?PropertyData
    {
        $existing = $this->propertyRepository->findById($id);
        if (!$existing) {
            return null;
        }

        $cmd = new UpdatePropertyCommand(status: $status);
        return $this->propertyRepository->updateProperty($id, $cmd);
    }
}
