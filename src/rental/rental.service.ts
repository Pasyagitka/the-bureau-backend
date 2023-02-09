import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brigadier } from '../brigadier/entities/brigadier.entity';
import { NotExistsError } from '../common/exceptions';
import { Tool } from '../tool/entities/tool.entity';
import { CreateRentalDto } from './dto/create-rental.dto';
import { RentalQueryDto } from './dto/rental-query.dto';
import { Rental } from './entities/rental.entity';
import { RentalStatus } from './types/rental-status.enum';

//TODO implement tool rental
@Injectable()
export class RentalService {
  constructor(
    @InjectRepository(Rental)
    private rentalRepository: Repository<Rental>,
    @InjectRepository(Tool)
    private toolRepository: Repository<Tool>,
    @InjectRepository(Brigadier)
    private brigadierRepository: Repository<Brigadier>,
  ) {}

  async open(createRentalDto: CreateRentalDto) { //проверять не занято ли
    const tool = await this.toolRepository.findOne({
      where: { id: createRentalDto.toolId },
    });
    if (!tool) throw new NotExistsError('tool');

    const brigader = await this.brigadierRepository.findOne({
      where: { id: createRentalDto.brigadierId },
    });
    if (!brigader) throw new NotExistsError('brigader');
    const item = this.rentalRepository.create(createRentalDto);
    item.tool = tool;
    item.brigadier = brigader;
    item.quantity = createRentalDto.quantity;
    item.startDate = createRentalDto.startDate;
    item.endDate = createRentalDto.endDate;
    item.status = RentalStatus.INPROCESSING;
    item.price = createRentalDto.quantity * tool.rental_price;
    return await this.rentalRepository.save(item);
  }

  findAll(query: RentalQueryDto) {
    return this.rentalRepository.find({
      where: [
        {
          brigadier: { id: query.brigadierId },
          tool: { id: query.toolId },
        },
      ],
      relations: {
        tool: true,
        brigadier: true,
      },
      order: { id: 'ASC' },
    });
  }

  async approve(id: number) {
    const rental = await this.rentalRepository.findOne({ where: { id } });
    if (!rental) throw new NotExistsError('rental');
    rental.status = RentalStatus.APPROVED;
    return this.rentalRepository.save(rental);
  }

  async close(id: number) {
    const rental = await this.rentalRepository.findOne({ where: { id } });
    if (!rental) throw new NotExistsError('rental');
    rental.status = RentalStatus.CLOSED;
    return this.rentalRepository.save(rental);
  }
}
